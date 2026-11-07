/**
 * DualSense Music Studio - High Definition SoundBank & Audio Engine
 * Pulls real sampled instruments from General MIDI SoundFont banks (MusyngKite / FluidR3_GM)
 * with intelligent multi-sample pitch-shifting, studio Reverb/Delay/Filter, Drum Sampler,
 * and offline studio synthesis fallback.
 */

const GM_INSTRUMENTS = [
    // Piyano & Tuşlular
    { id: 'acoustic_grand_piano', name: 'Akustik Kuyruklu Piyano (Grand Piano)', category: 'Piyano & Tuşlular', gmProgram: 0, icon: '🎹', type: 'melodic' },
    { id: 'bright_acoustic_piano', name: 'Parlak Piyano (Bright Piano)', category: 'Piyano & Tuşlular', gmProgram: 1, icon: '🎹', type: 'melodic' },
    { id: 'electric_piano_1', name: 'Elektro Piyano (Rhodes EP)', category: 'Piyano & Tuşlular', gmProgram: 4, icon: '🎹', type: 'melodic' },
    { id: 'harpsichord', name: 'Klavsen (Harpsichord)', category: 'Piyano & Tuşlular', gmProgram: 6, icon: '🎼', type: 'melodic' },
    { id: 'church_organ', name: 'Kilise Orgu (Church Organ)', category: 'Piyano & Tuşlular', gmProgram: 19, icon: '⛪', type: 'melodic' },
    { id: 'accordion', name: 'Akordeon (Accordion)', category: 'Piyano & Tuşlular', gmProgram: 21, icon: '🪗', type: 'melodic' },

    // Gitarlar
    { id: 'acoustic_guitar_nylon', name: 'Klasik Gitar (Nylon Guitar)', category: 'Gitar & Telli', gmProgram: 24, icon: '🎸', type: 'melodic' },
    { id: 'acoustic_guitar_steel', name: 'Akustik Gitar (Steel Guitar)', category: 'Gitar & Telli', gmProgram: 25, icon: '🎸', type: 'melodic' },
    { id: 'electric_guitar_clean', name: 'Elektro Gitar (Clean Jazz/Pop)', category: 'Gitar & Telli', gmProgram: 27, icon: '🎸', type: 'melodic' },
    { id: 'overdriven_guitar', name: 'Elektro Gitar (Overdrive)', category: 'Gitar & Telli', gmProgram: 29, icon: '⚡', type: 'melodic' },
    { id: 'distortion_guitar', name: 'Elektro Gitar (Rock Distortion)', category: 'Gitar & Telli', gmProgram: 30, icon: '🔥', type: 'melodic' },

    // Yaylılar & Orkestra
    { id: 'violin', name: 'Keman (Solo Violin)', category: 'Yaylılar & Orkestra', gmProgram: 40, icon: '🎻', type: 'melodic' },
    { id: 'cello', name: 'Çello (Violoncello)', category: 'Yaylılar & Orkestra', gmProgram: 42, icon: '🎻', type: 'melodic' },
    { id: 'string_ensemble_1', name: 'Yaylı Orkestrası (Strings Ensemble)', category: 'Yaylılar & Orkestra', gmProgram: 48, icon: '🎻', type: 'melodic' },
    { id: 'pizzicato_strings', name: 'Pizzicato Yaylılar (Plucked)', category: 'Yaylılar & Orkestra', gmProgram: 45, icon: '🎶', type: 'melodic' },
    { id: 'orchestral_harp', name: 'Orkestra Arpı (Concert Harp)', category: 'Yaylılar & Orkestra', gmProgram: 46, icon: '🪉', type: 'melodic' },
    { id: 'choir_aahs', name: 'Koro Vokal (Choir Aahs)', category: 'Yaylılar & Orkestra', gmProgram: 52, icon: '🗣️', type: 'melodic' },

    // Nefesliler (Üflemeliler)
    { id: 'trumpet', name: 'Trompet (Trumpet)', category: 'Üflemeliler', gmProgram: 56, icon: '🎺', type: 'melodic' },
    { id: 'alto_sax', name: 'Alto Saksafon (Saxophone)', category: 'Üflemeliler', gmProgram: 65, icon: '🎷', type: 'melodic' },
    { id: 'flute', name: 'Yan Flüt (Concert Flute)', category: 'Üflemeliler', gmProgram: 73, icon: '🪈', type: 'melodic' },
    { id: 'clarinet', name: 'Klarnet (Clarinet)', category: 'Üflemeliler', gmProgram: 71, icon: '🪈', type: 'melodic' },
    { id: 'pan_flute', name: 'Pan Flüt / Ney (Pan Flute)', category: 'Üflemeliler', gmProgram: 75, icon: '🍃', type: 'melodic' },

    // Bas Enstrümanlar
    { id: 'acoustic_bass', name: 'Akustik Kontrbas (Acoustic Bass)', category: 'Bas', gmProgram: 32, icon: '🎸', type: 'melodic' },
    { id: 'electric_bass_finger', name: 'Bas Gitar (Fingered Bass)', category: 'Bas', gmProgram: 33, icon: '🎸', type: 'melodic' },
    { id: 'slap_bass_1', name: 'Slap Bas Gitar (Funk Slap)', category: 'Bas', gmProgram: 36, icon: '💥', type: 'melodic' },
    { id: 'synth_bass_1', name: 'Synth Bass (808 / Sub Bass)', category: 'Bas', gmProgram: 38, icon: '🔊', type: 'melodic' },

    // Synthesizer & Elektronik
    { id: 'lead_1_square', name: 'Synth Lead (Retro Square)', category: 'Synthesizer', gmProgram: 80, icon: '🎛️', type: 'melodic' },
    { id: 'lead_2_sawtooth', name: 'Synth Lead (Supersaw Trance)', category: 'Synthesizer', gmProgram: 81, icon: '⚡', type: 'melodic' },
    { id: 'pad_1_new_age', name: 'Ambient Pad (New Age Dream)', category: 'Synthesizer', gmProgram: 88, icon: '🌌', type: 'melodic' },
    { id: 'pad_2_warm', name: 'Warm Synth Pad (Analog)', category: 'Synthesizer', gmProgram: 89, icon: '☀️', type: 'melodic' },

    // Etnik & Perküsyon Melodik
    { id: 'sitar', name: 'Sitar / Doğu Telli (Sitar)', category: 'Etnik & Melodik Perküsyon', gmProgram: 104, icon: '🪕', type: 'melodic' },
    { id: 'kalimba', name: 'Kalimba (Thumb Piano)', category: 'Etnik & Melodik Perküsyon', gmProgram: 108, icon: '✨', type: 'melodic' },
    { id: 'marimba', name: 'Marimba / Ksilofon', category: 'Etnik & Melodik Perküsyon', gmProgram: 12, icon: '🪵', type: 'melodic' },

    // Bateri & Ritim Seti (Drum Kit)
    { id: 'drum_kick', name: 'Bateri: Kick (Bas Davul)', category: 'Bateri & Ritim', gmProgram: 128, drumMidi: 36, icon: '🥁', type: 'drum' },
    { id: 'drum_snare', name: 'Bateri: Snare (Trampet)', category: 'Bateri & Ritim', gmProgram: 128, drumMidi: 38, icon: '🥁', type: 'drum' },
    { id: 'drum_hihat_closed', name: 'Bateri: Closed Hi-Hat (Kapalı Zil)', category: 'Bateri & Ritim', gmProgram: 128, drumMidi: 42, icon: '📀', type: 'drum' },
    { id: 'drum_hihat_open', name: 'Bateri: Open Hi-Hat (Açık Zil)', category: 'Bateri & Ritim', gmProgram: 128, drumMidi: 46, icon: '📀', type: 'drum' },
    { id: 'drum_clap', name: 'Bateri: Clap (Alkış / 808)', category: 'Bateri & Ritim', gmProgram: 128, drumMidi: 39, icon: '👏', type: 'drum' },
    { id: 'drum_tom_high', name: 'Bateri: High Tom (İnce Tom)', category: 'Bateri & Ritim', gmProgram: 128, drumMidi: 50, icon: '🥁', type: 'drum' },
    { id: 'drum_tom_low', name: 'Bateri: Low Floor Tom (Kalın Tom)', category: 'Bateri & Ritim', gmProgram: 128, drumMidi: 45, icon: '🥁', type: 'drum' },
    { id: 'drum_crash', name: 'Bateri: Crash Cymbal (Patlama Zili)', category: 'Bateri & Ritim', gmProgram: 128, drumMidi: 49, icon: '💥', type: 'drum' },
    { id: 'drum_ride', name: 'Bateri: Ride Cymbal (Ritim Zili)', category: 'Bateri & Ritim', gmProgram: 128, drumMidi: 51, icon: '🔔', type: 'drum' },
    { id: 'drum_808_kick', name: '808 Sub Kick (Trap/HipHop)', category: 'Bateri & Ritim', gmProgram: 128, drumMidi: 35, icon: '💣', type: 'drum' }
];

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const TURKISH_NOTE_NAMES = {
    'C': 'Do', 'C#': 'Do#', 'Db': 'Reb',
    'D': 'Re', 'D#': 'Re#', 'Eb': 'Mib',
    'E': 'Mi',
    'F': 'Fa', 'F#': 'Fa#', 'Gb': 'Solb',
    'G': 'Sol', 'G#': 'Sol#', 'Ab': 'Lab',
    'A': 'La', 'A#': 'La#', 'Bb': 'Sib',
    'B': 'Si'
};

// Reference sample anchor notes to fetch from SoundFont CDN (covers full range cleanly with minimal bandwidth)
const SAMPLE_ANCHOR_NOTES = [
    'C2', 'F#2', 'C3', 'F#3', 'C4', 'Eb4', 'F#4', 'A4', 'C5', 'Eb5', 'F#5', 'C6'
];

class SoundBankEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.reverbNode = null;
        this.reverbGain = null;
        this.dryGain = null;
        this.filterNode = null;
        this.analyser = null;
        this.mediaStreamDest = null;

        // Cache of loaded AudioBuffers: instrumentId -> { midiNumber: AudioBuffer }
        this.sampleCache = new Map();
        this.loadingInstruments = new Map();
        this.customSamples = new Map(); // user uploaded .wav/.mp3 files

        // Currently playing voices: voiceKey -> { stop: fn, pitchBend: fn }
        this.activeVoices = new Map();

        // Global FX parameters
        this.masterVolume = 0.85;
        this.reverbAmount = 0.25;
        this.filterCutoff = 18000;
        this.globalPitchBendSemitones = 0;

        // Status callback
        this.onStatusChange = null;
    }

    init() {
        if (this.ctx) {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            return;
        }

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx({ latencyHint: 'interactive', sampleRate: 44100 });

        // Master Chain: Filter -> Dry + Reverb -> MasterGain -> Analyser -> Destination (+ MediaStream for live recording)
        this.filterNode = this.ctx.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.value = this.filterCutoff;
        this.filterNode.Q.value = 1.2;

        this.dryGain = this.ctx.createGain();
        this.dryGain.gain.value = 1.0;

        this.reverbGain = this.ctx.createGain();
        this.reverbGain.gain.value = this.reverbAmount;

        this.reverbNode = this.ctx.createConvolver();
        this.reverbNode.buffer = this._createStudioImpulseResponse(2.2, 2.4);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.masterVolume;

        // Compressor to prevent clipping when playing chords
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.value = -12;
        this.compressor.knee.value = 18;
        this.compressor.ratio.value = 4;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.15;

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.82;

        this.mediaStreamDest = this.ctx.createMediaStreamDestination();

        // Connect graph
        this.filterNode.connect(this.dryGain);
        this.filterNode.connect(this.reverbNode);
        this.reverbNode.connect(this.reverbGain);

        this.dryGain.connect(this.compressor);
        this.reverbGain.connect(this.compressor);
        this.compressor.connect(this.masterGain);

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
        this.masterGain.connect(this.mediaStreamDest);

        // Preload default primary instruments immediately
        this.preloadInstrument('acoustic_grand_piano');
        this.preloadInstrument('violin');
        this.preloadInstrument('acoustic_guitar_nylon');
    }

    _createStudioImpulseResponse(duration, decay) {
        const rate = this.ctx.sampleRate;
        const length = rate * duration;
        const impulse = this.ctx.createBuffer(2, length, rate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);
        for (let i = 0; i < length; i++) {
            const n = i / length;
            const env = Math.pow(1 - n, decay);
            left[i] = (Math.random() * 2 - 1) * env;
            right[i] = (Math.random() * 2 - 1) * env;
        }
        return impulse;
    }

    setMasterVolume(val) {
        this.masterVolume = Math.max(0, Math.min(1.2, val));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.015);
        }
    }

    setReverbAmount(val) {
        this.reverbAmount = Math.max(0, Math.min(1, val));
        if (this.reverbGain && this.ctx) {
            this.reverbGain.gain.setTargetAtTime(this.reverbAmount, this.ctx.currentTime, 0.02);
        }
    }

    setFilterCutoff(freqHz) {
        this.filterCutoff = Math.max(120, Math.min(20000, freqHz));
        if (this.filterNode && this.ctx) {
            this.filterNode.frequency.setTargetAtTime(this.filterCutoff, this.ctx.currentTime, 0.02);
        }
    }

    /**
     * Converts Note String (e.g. "C4", "F#4", "Eb3") to MIDI number (60 = C4)
     */
    noteToMidi(noteStr) {
        if (typeof noteStr === 'number') return noteStr;
        const match = String(noteStr).trim().match(/^([A-Ga-g])([#b]?)(-?\d+)$/);
        if (!match) return 60;
        const letter = match[1].toUpperCase();
        const acc = match[2];
        const octave = parseInt(match[3], 10);

        const baseMap = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
        let semitone = baseMap[letter] ?? 0;
        if (acc === '#') semitone += 1;
        else if (acc === 'b') semitone -= 1;

        return (octave + 1) * 12 + semitone;
    }

    /**
     * Converts MIDI number (e.g. 60) to Note Name ("C4" or "Db4")
     */
    midiToNoteName(midi, preferFlats = false) {
        const m = Math.round(midi);
        const octave = Math.floor(m / 12) - 1;
        const idx = ((m % 12) + 12) % 12;
        const name = preferFlats ? FLAT_NAMES[idx] : NOTE_NAMES[idx];
        return `${name}${octave}`;
    }

    midiToTurkishName(midi, preferFlats = false) {
        const m = Math.round(midi);
        const octave = Math.floor(m / 12) - 1;
        const idx = ((m % 12) + 12) % 12;
        const name = preferFlats ? FLAT_NAMES[idx] : NOTE_NAMES[idx];
        const tr = TURKISH_NOTE_NAMES[name] || name;
        return `${tr}${octave} (${name}${octave})`;
    }

    midiToFreq(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    /**
     * Fetches real studio samples from Gleitzman's Midi-JS-Soundfonts CDN (MusyngKite / FluidR3_GM)
     */
    async preloadInstrument(instrumentId) {
        this.init();
        if (!instrumentId || instrumentId.startsWith('drum_') || instrumentId.startsWith('custom_')) {
            return true;
        }
        if (this.sampleCache.has(instrumentId)) {
            return true;
        }
        if (this.loadingInstruments.has(instrumentId)) {
            return this.loadingInstruments.get(instrumentId);
        }

        const loadPromise = (async () => {
            if (this.onStatusChange) {
                const info = GM_INSTRUMENTS.find(i => i.id === instrumentId);
                this.onStatusChange(`Ses bankası yükleniyor: ${info ? info.name : instrumentId}...`, 'loading');
            }

            const noteBufferMap = {};
            const baseUrl = `https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/MusyngKite/${instrumentId}-mp3`;

            try {
                const fetchPromises = SAMPLE_ANCHOR_NOTES.map(async (noteName) => {
                    const url = `${baseUrl}/${encodeURIComponent(noteName)}.mp3`;
                    const resp = await fetch(url);
                    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                    const arrayBuf = await resp.arrayBuffer();
                    const audioBuf = await this.ctx.decodeAudioData(arrayBuf);
                    const midi = this.noteToMidi(noteName);
                    noteBufferMap[midi] = audioBuf;
                });

                await Promise.allSettled(fetchPromises);

                if (Object.keys(noteBufferMap).length > 0) {
                    this.sampleCache.set(instrumentId, noteBufferMap);
                    if (this.onStatusChange) {
                        const info = GM_INSTRUMENTS.find(i => i.id === instrumentId);
                        this.onStatusChange(`Hazır: ${info ? info.name : instrumentId} (Gerçek Ses Bankası Aktif)`, 'ready');
                    }
                    return true;
                } else {
                    throw new Error('Hiçbir örnek indirilemedi');
                }
            } catch (err) {
                console.warn(`SoundFont CDN yüklenemedi (${instrumentId}), dahili stüdyo sentezleyici kullanılacak:`, err);
                if (this.onStatusChange) {
                    this.onStatusChange(`Çevrimdışı Stüdyo Sentezleyici Aktif (${instrumentId})`, 'offline');
                }
                return false;
            } finally {
                this.loadingInstruments.delete(instrumentId);
            }
        })();

        this.loadingInstruments.set(instrumentId, loadPromise);
        return loadPromise;
    }

    /**
     * Allows user to load custom .wav / .mp3 file from their PC as an instrument
     */
    async registerCustomSample(file) {
        this.init();
        const arrayBuf = await file.arrayBuffer();
        const audioBuf = await this.ctx.decodeAudioData(arrayBuf);
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        const customId = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

        this.customSamples.set(customId, {
            id: customId,
            name: `Özel Ses: ${cleanName}`,
            buffer: audioBuf,
            baseMidi: 60 // Middle C reference
        });

        GM_INSTRUMENTS.unshift({
            id: customId,
            name: `📂 ${cleanName} (Kullanıcı Sesi)`,
            category: 'Özel Yüklenen Sesler',
            gmProgram: 0,
            icon: '📂',
            type: 'melodic'
        });

        return customId;
    }

    /**
     * Play a note (or chord/drum) and return a handle to stop or bend it
     * @param {string} voiceId Unique ID for button/channel so holding & releasing works cleanly
     * @param {string} instrumentId Instrument ID from GM_INSTRUMENTS
     * @param {number} midiNote MIDI note number (e.g., 60 for C4)
     * @param {number} velocity 0.0 to 1.0 (from L2/R2 trigger pressure or default 0.85)
     * @param {AudioNode} targetDest Optional custom destination (used for offline WAV rendering)
     * @param {BaseAudioContext} targetCtx Optional custom context (used for offline WAV rendering)
     */
    noteOn(voiceId, instrumentId, midiNote, velocity = 0.85, targetDest = null, targetCtx = null) {
        if (!targetCtx) {
            this.init();
        }
        const ctx = targetCtx || this.ctx;
        const dest = targetDest || this.filterNode;
        const now = ctx.currentTime;
        const vel = Math.max(0.1, Math.min(1.0, velocity));

        // Stop previous voice on same voiceId if playing
        if (!targetCtx && this.activeVoices.has(voiceId)) {
            this.noteOff(voiceId);
        }

        // Check if Drum
        if (instrumentId && instrumentId.startsWith('drum_')) {
            const voice = this._triggerStudioDrum(ctx, dest, instrumentId, vel, now);
            if (!targetCtx && voiceId) {
                this.activeVoices.set(voiceId, voice);
            }
            return voice;
        }

        // Check if Custom Uploaded Sample
        if (instrumentId && this.customSamples.has(instrumentId)) {
            const custom = this.customSamples.get(instrumentId);
            const voice = this._playBufferShifted(ctx, dest, custom.buffer, custom.baseMidi, midiNote, vel, now, instrumentId);
            if (!targetCtx && voiceId) {
                this.activeVoices.set(voiceId, voice);
            }
            return voice;
        }

        // Check if SoundFont Sample Cache has this instrument
        const bank = this.sampleCache.get(instrumentId);
        if (bank && Object.keys(bank).length > 0) {
            // Find closest sampled MIDI note
            let closestMidi = 60;
            let minDiff = 999;
            for (const anchorMidiStr of Object.keys(bank)) {
                const anchorMidi = parseInt(anchorMidiStr, 10);
                const diff = Math.abs(midiNote - anchorMidi);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestMidi = anchorMidi;
                }
            }
            const buffer = bank[closestMidi];
            if (buffer) {
                const voice = this._playBufferShifted(ctx, dest, buffer, closestMidi, midiNote, vel, now, instrumentId);
                if (!targetCtx && voiceId) {
                    this.activeVoices.set(voiceId, voice);
                }
                return voice;
            }
        } else if (!targetCtx) {
            // Trigger background load for next note
            this.preloadInstrument(instrumentId);
        }

        // Fallback high-definition physical/multi-oscillator synthesis so there is ZERO wait time
        const voice = this._playStudioSynthVoice(ctx, dest, instrumentId, midiNote, vel, now);
        if (!targetCtx && voiceId) {
            this.activeVoices.set(voiceId, voice);
        }
        return voice;
    }

    _playBufferShifted(ctx, dest, buffer, baseMidi, targetMidi, velocity, startTime, instrumentId) {
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const semitoneDiff = (targetMidi - baseMidi) + this.globalPitchBendSemitones;
        source.playbackRate.setValueAtTime(Math.pow(2, semitoneDiff / 12), startTime);

        const vca = ctx.createGain();
        const peakGain = velocity * 0.95;
        vca.gain.setValueAtTime(0.001, startTime);
        vca.gain.linearRampToValueAtTime(peakGain, startTime + 0.008);

        source.connect(vca);
        vca.connect(dest);
        source.start(startTime);

        const releaseTime = this._getInstrumentReleaseTime(instrumentId);

        return {
            midiNote: targetMidi,
            instrumentId,
            setPitchBend: (bendSemitones) => {
                const totalDiff = (targetMidi - baseMidi) + bendSemitones;
                source.playbackRate.setTargetAtTime(Math.pow(2, totalDiff / 12), ctx.currentTime, 0.015);
            },
            stop: (stopTime = null) => {
                const t = stopTime ?? ctx.currentTime;
                try {
                    vca.gain.cancelScheduledValues(t);
                    vca.gain.setValueAtTime(Math.max(0.0001, vca.gain.value), t);
                    vca.gain.exponentialRampToValueAtTime(0.0001, t + releaseTime);
                    source.stop(t + releaseTime + 0.02);
                } catch (e) {}
            }
        };
    }

    _getInstrumentReleaseTime(instrumentId) {
        if (!instrumentId) return 0.35;
        if (instrumentId.includes('piano') || instrumentId.includes('guitar') || instrumentId.includes('harp') || instrumentId.includes('kalimba')) {
            return 0.65;
        }
        if (instrumentId.includes('pad') || instrumentId.includes('string') || instrumentId.includes('choir')) {
            return 0.85;
        }
        return 0.3;
    }

    /**
     * Studio-quality multi-oscillator synthesis fallback (used when offline or while SoundFont is streaming)
     */
    _playStudioSynthVoice(ctx, dest, instrumentId, midiNote, velocity, startTime) {
        const baseFreq = this.midiToFreq(midiNote + this.globalPitchBendSemitones);
        const vca = ctx.createGain();
        const voiceFilter = ctx.createBiquadFilter();
        voiceFilter.type = 'lowpass';

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc2Gain = ctx.createGain();

        let attack = 0.01;
        let decay = 0.3;
        let sustain = 0.5;
        let release = 0.35;

        if (instrumentId.includes('violin') || instrumentId.includes('cello') || instrumentId.includes('string')) {
            osc1.type = 'sawtooth';
            osc2.type = 'sawtooth';
            osc2.detune.value = 8;
            osc2Gain.gain.value = 0.5;
            voiceFilter.frequency.value = 2800;
            attack = 0.08;
            sustain = 0.85;
            release = 0.45;
        } else if (instrumentId.includes('flute') || instrumentId.includes('clarinet') || instrumentId.includes('pan')) {
            osc1.type = 'triangle';
            osc2.type = 'sine';
            osc2.detune.value = 3;
            osc2Gain.gain.value = 0.6;
            voiceFilter.frequency.value = 2200;
            attack = 0.05;
            sustain = 0.8;
            release = 0.25;
        } else if (instrumentId.includes('guitar') || instrumentId.includes('harp') || instrumentId.includes('sitar')) {
            osc1.type = 'sawtooth';
            osc2.type = 'triangle';
            osc2Gain.gain.value = 0.4;
            voiceFilter.frequency.setValueAtTime(4200, startTime);
            voiceFilter.frequency.exponentialRampToValueAtTime(900, startTime + 0.35);
            attack = 0.005;
            decay = 0.45;
            sustain = 0.2;
            release = 0.5;
        } else if (instrumentId.includes('bass')) {
            osc1.type = 'sawtooth';
            osc2.type = 'sine';
            osc2Gain.gain.value = 0.9;
            voiceFilter.frequency.setValueAtTime(1400, startTime);
            voiceFilter.frequency.exponentialRampToValueAtTime(320, startTime + 0.2);
            attack = 0.005;
            decay = 0.25;
            sustain = 0.45;
            release = 0.2;
        } else if (instrumentId.includes('lead') || instrumentId.includes('trumpet') || instrumentId.includes('sax')) {
            osc1.type = instrumentId.includes('square') ? 'square' : 'sawtooth';
            osc2.type = 'sawtooth';
            osc2.detune.value = 10;
            osc2Gain.gain.value = 0.55;
            voiceFilter.frequency.value = 3800;
            attack = 0.015;
            sustain = 0.75;
            release = 0.25;
        } else if (instrumentId.includes('pad') || instrumentId.includes('choir') || instrumentId.includes('organ')) {
            osc1.type = 'sawtooth';
            osc2.type = 'triangle';
            osc2.detune.value = 14;
            osc2Gain.gain.value = 0.7;
            voiceFilter.frequency.value = 1900;
            attack = 0.12;
            sustain = 0.9;
            release = 0.75;
        } else {
            // Default Piano / Electric Piano model
            osc1.type = 'triangle';
            osc2.type = 'sine';
            osc2.detune.value = 4;
            osc2Gain.gain.value = 0.45;
            voiceFilter.frequency.setValueAtTime(3600, startTime);
            voiceFilter.frequency.exponentialRampToValueAtTime(800, startTime + 0.6);
            attack = 0.006;
            decay = 0.5;
            sustain = 0.25;
            release = 0.45;
        }

        osc1.frequency.setValueAtTime(baseFreq, startTime);
        osc2.frequency.setValueAtTime(baseFreq, startTime);

        const peak = velocity * 0.4;
        vca.gain.setValueAtTime(0.0001, startTime);
        vca.gain.linearRampToValueAtTime(peak, startTime + attack);
        vca.gain.exponentialRampToValueAtTime(Math.max(0.001, peak * sustain), startTime + attack + decay);

        osc1.connect(voiceFilter);
        osc2.connect(osc2Gain);
        osc2Gain.connect(voiceFilter);
        voiceFilter.connect(vca);
        vca.connect(dest);

        osc1.start(startTime);
        osc2.start(startTime);

        return {
            midiNote,
            instrumentId,
            setPitchBend: (bendSemitones) => {
                const f = this.midiToFreq(midiNote + bendSemitones);
                osc1.frequency.setTargetAtTime(f, ctx.currentTime, 0.015);
                osc2.frequency.setTargetAtTime(f, ctx.currentTime, 0.015);
            },
            stop: (stopTime = null) => {
                const t = stopTime ?? ctx.currentTime;
                try {
                    vca.gain.cancelScheduledValues(t);
                    vca.gain.setValueAtTime(Math.max(0.0001, vca.gain.value), t);
                    vca.gain.exponentialRampToValueAtTime(0.0001, t + release);
                    osc1.stop(t + release + 0.02);
                    osc2.stop(t + release + 0.02);
                } catch (e) {}
            }
        };
    }

    /**
     * Studio Drum Engine (Kick, 808, Snare, Hi-Hat, Clap, Toms, Crash, Ride)
     */
    _triggerStudioDrum(ctx, dest, drumId, velocity, startTime) {
        const gain = velocity * 0.95;

        if (drumId === 'drum_kick' || drumId === 'drum_808_kick') {
            const is808 = drumId === 'drum_808_kick';
            const osc = ctx.createOscillator();
            const vca = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(is808 ? 140 : 165, startTime);
            osc.frequency.exponentialRampToValueAtTime(is808 ? 36 : 45, startTime + (is808 ? 0.14 : 0.08));
            osc.frequency.exponentialRampToValueAtTime(is808 ? 28 : 35, startTime + (is808 ? 0.75 : 0.35));

            vca.gain.setValueAtTime(gain, startTime);
            vca.gain.exponentialRampToValueAtTime(0.0001, startTime + (is808 ? 0.85 : 0.4));

            osc.connect(vca);
            vca.connect(dest);
            osc.start(startTime);
            osc.stop(startTime + (is808 ? 0.88 : 0.42));
        } else if (drumId === 'drum_snare') {
            // Tone body
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(185, startTime);
            osc.frequency.exponentialRampToValueAtTime(95, startTime + 0.1);
            oscGain.gain.setValueAtTime(gain * 0.65, startTime);
            oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);
            osc.connect(oscGain);
            oscGain.connect(dest);
            osc.start(startTime);
            osc.stop(startTime + 0.15);

            // Snare wires noise
            this._burstNoise(ctx, dest, startTime, 0.22, 1200, 'highpass', gain * 0.8);
        } else if (drumId === 'drum_clap') {
            // Multi-tap studio handclap
            [0, 0.011, 0.022, 0.034].forEach((offset, idx) => {
                const dur = idx === 3 ? 0.22 : 0.03;
                this._burstNoise(ctx, dest, startTime + offset, dur, 1100, 'bandpass', gain * 0.75);
            });
        } else if (drumId === 'drum_hihat_closed' || drumId === 'drum_hihat_open') {
            const dur = drumId === 'drum_hihat_open' ? 0.42 : 0.065;
            this._burstNoise(ctx, dest, startTime, dur, 7500, 'highpass', gain * 0.65);
        } else if (drumId === 'drum_tom_high' || drumId === 'drum_tom_low') {
            const isHigh = drumId === 'drum_tom_high';
            const osc = ctx.createOscillator();
            const vca = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(isHigh ? 210 : 125, startTime);
            osc.frequency.exponentialRampToValueAtTime(isHigh ? 95 : 55, startTime + 0.28);
            vca.gain.setValueAtTime(gain * 0.85, startTime);
            vca.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.32);
            osc.connect(vca);
            vca.connect(dest);
            osc.start(startTime);
            osc.stop(startTime + 0.35);
        } else if (drumId === 'drum_crash' || drumId === 'drum_ride') {
            const isCrash = drumId === 'drum_crash';
            this._burstNoise(ctx, dest, startTime, isCrash ? 1.15 : 0.65, isCrash ? 4800 : 6200, 'highpass', gain * 0.55);
        }

        return {
            midiNote: 36,
            instrumentId: drumId,
            setPitchBend: () => {},
            stop: () => {}
        };
    }

    _burstNoise(ctx, dest, startTime, duration, filterFreq, filterType, gainVal) {
        const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.setValueAtTime(filterFreq, startTime);

        const vca = ctx.createGain();
        vca.gain.setValueAtTime(gainVal, startTime);
        vca.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        noise.connect(filter);
        filter.connect(vca);
        vca.connect(dest);
        noise.start(startTime);
        noise.stop(startTime + duration + 0.01);
    }

    noteOff(voiceId) {
        const voice = this.activeVoices.get(voiceId);
        if (voice) {
            voice.stop();
            this.activeVoices.delete(voiceId);
        }
    }

    stopAllVoices() {
        for (const [id, voice] of this.activeVoices.entries()) {
            voice.stop();
        }
        this.activeVoices.clear();
    }

    /**
     * Apply continuous pitch bend to all currently held notes
     */
    setLivePitchBend(semitones) {
        this.globalPitchBendSemitones = semitones;
        for (const voice of this.activeVoices.values()) {
            if (voice && voice.setPitchBend) {
                voice.setPitchBend(semitones);
            }
        }
    }

    /**
     * Play metronome click
     */
    playMetronomeClick(isDownbeat = false) {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isDownbeat ? 1100 : 750, now);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    /**
     * Offline Studio WAV Renderer: Renders recorded multi-track events into a crystal-clear 44.1kHz 16-bit Stereo WAV file
     */
    async renderEventsToWavBlob(events, totalDurationSec = null) {
        if (!events || events.length === 0) {
            throw new Error('Dışa aktarılacak kayıtlı nota bulunamadı.');
        }

        // Preload any instrument used in the recording
        const uniqueInsts = [...new Set(events.map(e => e.instrumentId))];
        await Promise.allSettled(uniqueInsts.map(id => this.preloadInstrument(id)));

        const maxEnd = events.reduce((max, ev) => Math.max(max, (ev.startTime + (ev.duration || 0.35))), 0);
        const duration = Math.max(2, (totalDurationSec || maxEnd) + 1.5);
        const sampleRate = 44100;
        const offlineCtx = new OfflineAudioContext(2, Math.ceil(duration * sampleRate), sampleRate);

        const master = offlineCtx.createGain();
        master.gain.value = 0.85;
        master.connect(offlineCtx.destination);

        // Schedule every recorded note
        for (const ev of events) {
            const start = Math.max(0, ev.startTime);
            const dur = Math.max(0.08, ev.duration || 0.35);

            // Schedule at event start
            const voice = this._scheduleOfflineNote(offlineCtx, master, ev.instrumentId, ev.midiNote, ev.velocity || 0.85, start);
            if (voice && voice.stop) {
                voice.stop(start + dur);
            }
        }

        const renderedBuffer = await offlineCtx.startRendering();
        return this._audioBufferToWavBlob(renderedBuffer);
    }

    _scheduleOfflineNote(offlineCtx, dest, instrumentId, midiNote, velocity, startTime) {
        if (instrumentId && instrumentId.startsWith('drum_')) {
            return this._triggerStudioDrum(offlineCtx, dest, instrumentId, velocity, startTime);
        }
        if (instrumentId && this.customSamples.has(instrumentId)) {
            const custom = this.customSamples.get(instrumentId);
            return this._playBufferShifted(offlineCtx, dest, custom.buffer, custom.baseMidi, midiNote, velocity, startTime, instrumentId);
        }
        const bank = this.sampleCache.get(instrumentId);
        if (bank && Object.keys(bank).length > 0) {
            let closestMidi = 60;
            let minDiff = 999;
            for (const anchorMidiStr of Object.keys(bank)) {
                const anchorMidi = parseInt(anchorMidiStr, 10);
                const diff = Math.abs(midiNote - anchorMidi);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestMidi = anchorMidi;
                }
            }
            const buffer = bank[closestMidi];
            if (buffer) {
                return this._playBufferShifted(offlineCtx, dest, buffer, closestMidi, midiNote, velocity, startTime, instrumentId);
            }
        }
        return this._playStudioSynthVoice(offlineCtx, dest, instrumentId, midiNote, velocity, startTime);
    }

    _audioBufferToWavBlob(buffer) {
        const numOfChan = buffer.numberOfChannels;
        const length = buffer.length * numOfChan * 2 + 44;
        const out = new ArrayBuffer(length);
        const view = new DataView(out);
        const channels = [];
        let sample = 0;
        let offset = 0;
        let pos = 0;

        const setUint16 = (data) => { view.setUint16(pos, data, true); pos += 2; };
        const setUint32 = (data) => { view.setUint32(pos, data, true); pos += 4; };

        // RIFF identifier
        setUint32(0x46464952);
        setUint32(length - 8);
        setUint32(0x45564157);
        // fmt chunk
        setUint32(0x20746d66);
        setUint32(16);
        setUint16(1); // PCM
        setUint16(numOfChan);
        setUint32(buffer.sampleRate);
        setUint32(buffer.sampleRate * 2 * numOfChan);
        setUint16(numOfChan * 2);
        setUint16(16);
        // data chunk
        setUint32(0x61746164);
        setUint32(length - pos - 4);

        for (let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        while (pos < length) {
            for (let i = 0; i < numOfChan; i++) {
                sample = Math.max(-1, Math.min(1, channels[i][offset]));
                sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
                view.setInt16(pos, sample, true);
                pos += 2;
            }
            offset++;
        }

        return new Blob([out], { type: 'audio/wav' });
    }
}

window.GM_INSTRUMENTS = GM_INSTRUMENTS;
window.NOTE_NAMES = NOTE_NAMES;
window.TURKISH_NOTE_NAMES = TURKISH_NOTE_NAMES;
window.SoundBankEngine = SoundBankEngine;
