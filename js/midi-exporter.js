/**
 * DualSense Music Studio - Standard MIDI File (.mid) Binary Exporter (SMF Format 1)
 * Exports multi-instrument & drum recordings to universal .mid files compatible with
 * FL Studio, Ableton Live, Cubase, Logic Pro, Reaper, GarageBand, etc.
 */

class MidiExporter {
    /**
     * Generates a Standard MIDI File Blob from recorded note events
     * @param {Array} events Array of { midiNote, velocity, startTime, duration, instrumentId, trackId }
     * @param {number} bpm Tempo in Beats Per Minute
     * @returns {Blob} audio/midi Blob
     */
    static exportToMidiBlob(events, bpm = 120) {
        if (!events || events.length === 0) {
            throw new Error('MIDI olarak dışa aktarılacak nota bulunamadı.');
        }

        const ticksPerBeat = 480;
        const microsecondsPerBeat = Math.round(60000000 / (bpm || 120));
        const secondsToTicks = (sec) => Math.max(0, Math.round((sec * (bpm / 60)) * ticksPerBeat));

        // Group events by instrumentId so each instrument gets its own MIDI track & channel
        const groups = new Map();
        for (const ev of events) {
            const instId = ev.instrumentId || 'acoustic_grand_piano';
            if (!groups.has(instId)) {
                groups.set(instId, []);
            }
            groups.get(instId).push(ev);
        }

        const tracks = [];

        // Track 0: Tempo & Time Signature Master Track
        const tempoTrackEvents = [];
        // Track Name: DualSense Music Studio
        tempoTrackEvents.push({
            tick: 0,
            bytes: [0xFF, 0x03, ...this._stringToBytes('DualSense Music Studio')]
        });
        // Time Signature: 4/4
        tempoTrackEvents.push({
            tick: 0,
            bytes: [0xFF, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08]
        });
        // Set Tempo
        tempoTrackEvents.push({
            tick: 0,
            bytes: [
                0xFF, 0x51, 0x03,
                (microsecondsPerBeat >> 16) & 0xFF,
                (microsecondsPerBeat >> 8) & 0xFF,
                microsecondsPerBeat & 0xFF
            ]
        });
        tracks.push(this._encodeTrack(tempoTrackEvents));

        // Assign channels (0..15, with 9 reserved for General MIDI Percussion)
        let nextMelodicChannel = 0;

        for (const [instId, instEvents] of groups.entries()) {
            const instInfo = (window.GM_INSTRUMENTS || []).find(i => i.id === instId);
            const isDrum = instId.startsWith('drum_') || (instInfo && instInfo.type === 'drum');

            let channel = 9; // GM Drum Channel (Channel 10 in 1-based)
            if (!isDrum) {
                if (nextMelodicChannel === 9) nextMelodicChannel = 10;
                channel = nextMelodicChannel % 16;
                if (channel === 9) channel = 0;
                nextMelodicChannel++;
            }

            const trackMessages = [];

            // Track Name Meta Event
            const trackTitle = instInfo ? instInfo.name.replace(/[^\x20-\x7E]/g, '') : instId;
            trackMessages.push({
                tick: 0,
                bytes: [0xFF, 0x03, ...this._stringToBytes(trackTitle || 'Instrument Track')]
            });

            // Program Change for Melodic Instruments
            if (!isDrum) {
                const gmProgram = (instInfo && typeof instInfo.gmProgram === 'number') ? instInfo.gmProgram : 0;
                trackMessages.push({
                    tick: 0,
                    bytes: [0xC0 | channel, gmProgram & 0x7F]
                });
            }

            // Convert each note into NoteOn and NoteOff MIDI messages
            for (const ev of instEvents) {
                const startTick = secondsToTicks(ev.startTime);
                const durTicks = Math.max(ticksPerBeat / 16, secondsToTicks(ev.duration || 0.3));
                const endTick = startTick + durTicks;

                const midiNote = isDrum
                    ? ((instInfo && instInfo.drumMidi) ? instInfo.drumMidi : 36)
                    : Math.max(0, Math.min(127, Math.round(ev.midiNote || 60)));

                const vel = Math.max(1, Math.min(127, Math.round((ev.velocity || 0.85) * 127)));

                trackMessages.push({
                    tick: startTick,
                    typeOrder: 1, // NoteOn after NoteOff if at same tick
                    bytes: [0x90 | channel, midiNote, vel]
                });

                trackMessages.push({
                    tick: endTick,
                    typeOrder: 0, // NoteOff first
                    bytes: [0x80 | channel, midiNote, 0x40]
                });
            }

            tracks.push(this._encodeTrack(trackMessages));
        }

        // Assemble Header Chunk + All Track Chunks
        const headerBytes = [
            0x4D, 0x54, 0x68, 0x64, // "MThd"
            0x00, 0x00, 0x00, 0x06, // Header length = 6
            0x00, 0x01,             // Format 1 (multi-track)
            (tracks.length >> 8) & 0xFF, tracks.length & 0xFF,
            (ticksPerBeat >> 8) & 0xFF, ticksPerBeat & 0xFF
        ];

        const totalLength = headerBytes.length + tracks.reduce((sum, t) => sum + t.length, 0);
        const output = new Uint8Array(totalLength);
        output.set(headerBytes, 0);

        let offset = headerBytes.length;
        for (const t of tracks) {
            output.set(t, offset);
            offset += t.length;
        }

        return new Blob([output], { type: 'audio/midi' });
    }

    static _encodeTrack(messages) {
        // Sort messages by tick, then NoteOff before NoteOn
        messages.sort((a, b) => {
            if (a.tick !== b.tick) return a.tick - b.tick;
            return (a.typeOrder ?? 0) - (b.typeOrder ?? 0);
        });

        const body = [];
        let lastTick = 0;

        for (const msg of messages) {
            const delta = Math.max(0, msg.tick - lastTick);
            lastTick = msg.tick;
            body.push(...this._writeVarLen(delta));
            body.push(...msg.bytes);
        }

        // End of Track Meta Event
        body.push(0x00, 0xFF, 0x2F, 0x00);

        const len = body.length;
        const header = [
            0x4D, 0x54, 0x72, 0x6B, // "MTrk"
            (len >> 24) & 0xFF,
            (len >> 16) & 0xFF,
            (len >> 8) & 0xFF,
            len & 0xFF
        ];

        return new Uint8Array([...header, ...body]);
    }

    static _writeVarLen(value) {
        let buffer = value & 0x7F;
        const bytes = [];
        while ((value >>= 7) > 0) {
            buffer <<= 8;
            buffer |= ((value & 0x7F) | 0x80);
        }
        while (true) {
            bytes.push(buffer & 0xFF);
            if (buffer & 0x80) buffer >>= 8;
            else break;
        }
        return bytes;
    }

    static _stringToBytes(str) {
        const clean = str.slice(0, 64);
        const arr = [];
        for (let i = 0; i < clean.length; i++) {
            arr.push(clean.charCodeAt(i) & 0x7F);
        }
        return [arr.length, ...arr];
    }
}

window.MidiExporter = MidiExporter;
