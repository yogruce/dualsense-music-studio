/**
 * DualSense Music Studio - Main Studio Application Controller
 * Manages Mode 1 (12-Button Custom Multi-Instrument Matrix),
 * Mode 2 (8-Button Scale Melodic + Right Stick Sharp/Flat + 3-in-1 Left D-Pad),
 * Multi-Track Looper/Recorder, Piano Roll Visualizer, and WAV / MIDI Exports.
 */

const SCALES = {
    major: { name: 'Do Majör / Doğal (Do-Re-Mi-Fa-Sol-La-Si-Do)', intervals: [0, 2, 4, 5, 7, 9, 11, 12], dpadExtra: [-5, -3, -1, 14] },
    minor: { name: 'Doğal Minör / Nihavend (Do-Re-Mib-Fa-Sol-Lab-Sib-Do)', intervals: [0, 2, 3, 5, 7, 8, 10, 12], dpadExtra: [-5, -4, -2, 14] },
    hicaz: { name: 'Hicaz Makamı (Do-Reb-Mi-Fa-Sol-Lab-Sib-Do)', intervals: [0, 1, 4, 5, 7, 8, 10, 12], dpadExtra: [-5, -4, -2, 13] },
    kurdi: { name: 'Kürdi / Phrygian (Do-Reb-Mib-Fa-Sol-Lab-Sib-Do)', intervals: [0, 1, 3, 5, 7, 8, 10, 12], dpadExtra: [-5, -4, -2, 13] },
    pentatonic: { name: 'Pentatonik (Do-Re-Mi-Sol-La-Do-Re-Mi)', intervals: [0, 2, 4, 7, 9, 12, 14, 16], dpadExtra: [-5, -3, 19, 21] },
    harmonic_minor: { name: 'Armonik Minör (Do-Re-Mib-Fa-Sol-Lab-Si-Do)', intervals: [0, 2, 3, 5, 7, 8, 11, 12], dpadExtra: [-5, -4, -1, 14] }
};

const CHORD_TYPES = {
    single: { name: 'Tek Nota', offsets: [0] },
    major: { name: 'Majör Akor (3 Ses)', offsets: [0, 4, 7] },
    minor: { name: 'Minör Akor (3 Ses)', offsets: [0, 3, 7] },
    power: { name: 'Power Chord (5\'li Rock)', offsets: [0, 7, 12] },
    maj7: { name: 'Majör 7\'li Akor', offsets: [0, 4, 7, 11] },
    min7: { name: 'Minör 7\'li Akor', offsets: [0, 3, 7, 10] },
    octave: { name: 'Çift Oktav (Kalın + İnce)', offsets: [0, 12] }
};

const MODE1_PRESETS = {
    orchestra: {
        name: '🎻 Senfonik Orkestra & Piyano Seti',
        mappings: {
            cross:    { instrumentId: 'acoustic_grand_piano', note: 'C', octave: 4, chord: 'major' },
            circle:   { instrumentId: 'acoustic_grand_piano', note: 'G', octave: 3, chord: 'major' },
            square:   { instrumentId: 'acoustic_grand_piano', note: 'A', octave: 3, chord: 'minor' },
            triangle: { instrumentId: 'acoustic_grand_piano', note: 'F', octave: 3, chord: 'major' },
            l1:       { instrumentId: 'violin', note: 'E', octave: 5, chord: 'single' },
            r1:       { instrumentId: 'violin', note: 'G', octave: 5, chord: 'single' },
            l2:       { instrumentId: 'cello', note: 'C', octave: 3, chord: 'octave' },
            r2:       { instrumentId: 'flute', note: 'C', octave: 5, chord: 'single' },
            down:     { instrumentId: 'drum_kick', note: 'C', octave: 3, chord: 'single' },
            left:     { instrumentId: 'drum_snare', note: 'D', octave: 3, chord: 'single' },
            up:       { instrumentId: 'orchestral_harp', note: 'C', octave: 4, chord: 'maj7' },
            right:    { instrumentId: 'choir_aahs', note: 'A', octave: 4, chord: 'minor' }
        }
    },
    rock_band: {
        name: '🎸 Rock / Gitar Stüdyo Seti',
        mappings: {
            cross:    { instrumentId: 'distortion_guitar', note: 'E', octave: 3, chord: 'power' },
            circle:   { instrumentId: 'distortion_guitar', note: 'G', octave: 3, chord: 'power' },
            square:   { instrumentId: 'distortion_guitar', note: 'A', octave: 3, chord: 'power' },
            triangle: { instrumentId: 'distortion_guitar', note: 'C', octave: 4, chord: 'power' },
            l1:       { instrumentId: 'electric_bass_finger', note: 'E', octave: 2, chord: 'single' },
            r1:       { instrumentId: 'electric_guitar_clean', note: 'E', octave: 4, chord: 'minor' },
            l2:       { instrumentId: 'overdriven_guitar', note: 'B', octave: 4, chord: 'single' },
            r2:       { instrumentId: 'overdriven_guitar', note: 'E', octave: 5, chord: 'single' },
            down:     { instrumentId: 'drum_kick', note: 'C', octave: 3, chord: 'single' },
            left:     { instrumentId: 'drum_snare', note: 'D', octave: 3, chord: 'single' },
            up:       { instrumentId: 'drum_hihat_closed', note: 'F#', octave: 3, chord: 'single' },
            right:    { instrumentId: 'drum_crash', note: 'C#', octave: 4, chord: 'single' }
        }
    },
    lofi_hiphop: {
        name: '🎧 Lo-Fi & 808 Beatmaker Seti',
        mappings: {
            cross:    { instrumentId: 'electric_piano_1', note: 'C', octave: 4, chord: 'min7' },
            circle:   { instrumentId: 'electric_piano_1', note: 'F', octave: 3, chord: 'min7' },
            square:   { instrumentId: 'electric_piano_1', note: 'G#', octave: 3, chord: 'maj7' },
            triangle: { instrumentId: 'electric_piano_1', note: 'G', octave: 3, chord: 'major' },
            l1:       { instrumentId: 'synth_bass_1', note: 'C', octave: 2, chord: 'single' },
            r1:       { instrumentId: 'synth_bass_1', note: 'F', octave: 2, chord: 'single' },
            l2:       { instrumentId: 'alto_sax', note: 'G', octave: 4, chord: 'single' },
            r2:       { instrumentId: 'kalimba', note: 'C', octave: 5, chord: 'single' },
            down:     { instrumentId: 'drum_808_kick', note: 'C', octave: 2, chord: 'single' },
            left:     { instrumentId: 'drum_snare', note: 'D', octave: 3, chord: 'single' },
            up:       { instrumentId: 'drum_hihat_closed', note: 'F#', octave: 3, chord: 'single' },
            right:    { instrumentId: 'drum_clap', note: 'D#', octave: 3, chord: 'single' }
        }
    },
    acoustic_east: {
        name: '🪕 Akustik & Doğu Ezgileri Seti',
        mappings: {
            cross:    { instrumentId: 'acoustic_guitar_nylon', note: 'D', octave: 4, chord: 'minor' },
            circle:   { instrumentId: 'acoustic_guitar_nylon', note: 'G', octave: 3, chord: 'minor' },
            square:   { instrumentId: 'acoustic_guitar_nylon', note: 'A', octave: 3, chord: 'major' },
            triangle: { instrumentId: 'acoustic_guitar_nylon', note: 'A#', octave: 3, chord: 'major' },
            l1:       { instrumentId: 'pan_flute', note: 'D', octave: 5, chord: 'single' },
            r1:       { instrumentId: 'pan_flute', note: 'F', octave: 5, chord: 'single' },
            l2:       { instrumentId: 'sitar', note: 'A', octave: 4, chord: 'single' },
            r2:       { instrumentId: 'violin', note: 'D', octave: 5, chord: 'single' },
            down:     { instrumentId: 'drum_tom_low', note: 'C', octave: 3, chord: 'single' },
            left:     { instrumentId: 'drum_tom_high', note: 'D', octave: 3, chord: 'single' },
            up:       { instrumentId: 'drum_hihat_closed', note: 'F#', octave: 3, chord: 'single' },
            right:    { instrumentId: 'drum_clap', note: 'E', octave: 3, chord: 'single' }
        }
    }
};

class StudioApp {
    constructor() {
        this.soundEngine = new SoundBankEngine();
        this.mode = 'mode2'; // 'mode1' = Custom Multi-Instrument Matrix, 'mode2' = Direct 8-Note + Joystick #/b

        // Mode 1 State: 12 Button Custom Assignments
        this.mode1Mappings = JSON.parse(JSON.stringify(MODE1_PRESETS.orchestra.mappings));

        // Mode 2 State: Direct Note Mode
        this.mode2State = {
            instrumentId: 'acoustic_grand_piano',
            rootNote: 'C', // Root key
            octave: 4,     // Base octave (C4)
            scale: 'major',
            // 8 Main Buttons mapped to the 8 degrees of the scale (1..8)
            buttonOrder: ['cross', 'circle', 'square', 'triangle', 'l1', 'r1', 'l2', 'r2'],
            // Left D-Pad Mode in Mode 2:
            // 'drums' = Kick/Snare/HiHat/Clap accompaniment
            // 'extra_notes' = 4 Extra Scale Notes (12-Note Expanded Keyboard)
            // 'navigation' = Octave Up/Down & Instrument Prev/Next
            dpadMode: 'drums',
            dpadDrums: {
                down: 'drum_kick',
                left: 'drum_snare',
                up: 'drum_hihat_closed',
                right: 'drum_clap'
            }
        };

        // Right Joystick Sharp (#) / Flat (b) State
        this.accidentalSemitone = 0; // -1 = Bemol (b), 0 = Doğal, +1 = Diyez (#)

        // Track / Recording / Looper State
        this.bpm = 120;
        this.metronomeEnabled = false;
        this.metronomeTimer = null;
        this.isRecording = false;
        this.isPlayingBack = false;
        this.recordStartTime = 0;
        this.playbackStartTime = 0;
        this.playbackTimeouts = [];

        // Multi-Track Events: { id, trackIndex, buttonId, instrumentId, midiNote, velocity, startTime, duration }
        this.recordedEvents = [];
        this.activeRecordingNotes = new Map(); // voiceKey -> eventObj
        this.currentTrackIndex = 1;

        this.controller = new DualSenseController({
            onButtonDown: (btnId, velocity, src) => this.handleButtonDown(btnId, velocity, src),
            onButtonUp: (btnId, src) => this.handleButtonUp(btnId, src),
            onRightStickChange: (accidental, rx, ry) => this.handleRightStick(accidental, rx, ry),
            onLeftStickChange: (lx, ry) => this.handleLeftStick(lx, ry),
            onUtilityButton: (utilId) => this.handleUtilityButton(utilId),
            onConnectionChange: (connected, name) => this.updateControllerStatus(connected, name)
        });

        this.initUI();
        this.startVisualizers();
    }

    initUI() {
        // SoundBank status bar updates
        this.soundEngine.onStatusChange = (msg, status) => {
            const el = document.getElementById('soundbank-status');
            if (el) {
                el.textContent = msg;
                el.className = `status-pill status-${status}`;
            }
        };

        // Mode switcher tabs
        document.getElementById('tab-mode1').addEventListener('click', () => this.switchMode('mode1'));
        document.getElementById('tab-mode2').addEventListener('click', () => this.switchMode('mode2'));

        // Mode 1 Preset selector
        const presetSelect = document.getElementById('mode1-preset-select');
        presetSelect.addEventListener('change', (e) => {
            const preset = MODE1_PRESETS[e.target.value];
            if (preset) {
                this.mode1Mappings = JSON.parse(JSON.stringify(preset.mappings));
                this.renderMode1Grid();
                this.updateControllerLabels();
                this.preloadActiveInstruments();
            }
        });

        // Mode 2 Controls
        this.populateMode2Controls();

        // Transport & Recording Controls
        document.getElementById('btn-record').addEventListener('click', () => this.toggleRecording());
        document.getElementById('btn-play').addEventListener('click', () => this.togglePlayback());
        document.getElementById('btn-clear').addEventListener('click', () => this.clearRecording());
        document.getElementById('btn-new-track').addEventListener('click', () => this.addNewLayerTrack());
        document.getElementById('btn-metronome').addEventListener('click', () => this.toggleMetronome());

        document.getElementById('bpm-input').addEventListener('change', (e) => {
            this.bpm = Math.max(40, Math.min(240, parseInt(e.target.value, 10) || 120));
            e.target.value = this.bpm;
            if (this.metronomeEnabled) {
                this.toggleMetronome(false);
                this.toggleMetronome(true);
            }
        });

        // Export WAV & MIDI Buttons
        document.getElementById('btn-export-wav').addEventListener('click', () => this.exportWAV());
        document.getElementById('btn-export-midi').addEventListener('click', () => this.exportMIDI());

        // Custom Audio Sample Upload (.wav / .mp3)
        document.getElementById('custom-sample-input').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const newId = await this.soundEngine.registerCustomSample(file);
                this.populateMode2Controls();
                this.renderMode1Grid();
                this.mode2State.instrumentId = newId;
                document.getElementById('mode2-instrument').value = newId;
                this.updateControllerLabels();
                this.showToast(`"${file.name}" ses bankasına eklendi ve seçildi!`);
            } catch (err) {
                this.showToast(`Ses dosyası yüklenemedi: ${err.message}`, true);
            }
        });

        // Master Volume & Reverb sliders
        document.getElementById('slider-volume').addEventListener('input', (e) => {
            this.soundEngine.setMasterVolume(parseFloat(e.target.value));
        });
        document.getElementById('slider-reverb').addEventListener('input', (e) => {
            this.soundEngine.setReverbAmount(parseFloat(e.target.value));
        });

        // Interactive SVG Controller clicks
        document.querySelectorAll('[data-btn-id]').forEach(el => {
            const btnId = el.getAttribute('data-btn-id');
            el.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.controller.triggerVirtualDown(btnId);
            });
            el.addEventListener('mouseup', () => this.controller.triggerVirtualUp(btnId));
            el.addEventListener('mouseleave', () => this.controller.triggerVirtualUp(btnId));
        });

        // Accidental UI toggle buttons (for mouse testing)
        document.getElementById('btn-acc-flat').addEventListener('mousedown', () => this.handleRightStick(-1, -0.9, 0));
        document.getElementById('btn-acc-flat').addEventListener('mouseup', () => this.handleRightStick(0, 0, 0));
        document.getElementById('btn-acc-nat').addEventListener('click', () => this.handleRightStick(0, 0, 0));
        document.getElementById('btn-acc-sharp').addEventListener('mousedown', () => this.handleRightStick(1, 0.9, 0));
        document.getElementById('btn-acc-sharp').addEventListener('mouseup', () => this.handleRightStick(0, 0, 0));

        this.renderMode1Grid();
        this.renderMode2View();
        this.switchMode('mode2'); // Start in Mode 2 or user can switch freely
        this.updateTrackStats();
    }

    populateMode2Controls() {
        const instSelect = document.getElementById('mode2-instrument');
        const currentVal = this.mode2State.instrumentId;
        instSelect.innerHTML = '';

        // Group instruments by category
        const categories = {};
        for (const inst of GM_INSTRUMENTS) {
            if (!categories[inst.category]) categories[inst.category] = [];
            categories[inst.category].push(inst);
        }

        for (const [catName, list] of Object.entries(categories)) {
            const optGroup = document.createElement('optgroup');
            optGroup.label = catName;
            for (const inst of list) {
                const opt = document.createElement('option');
                opt.value = inst.id;
                opt.textContent = `${inst.icon} ${inst.name}`;
                optGroup.appendChild(opt);
            }
            instSelect.appendChild(optGroup);
        }
        instSelect.value = currentVal;

        instSelect.onchange = (e) => {
            this.mode2State.instrumentId = e.target.value;
            this.soundEngine.preloadInstrument(this.mode2State.instrumentId);
            this.renderMode2View();
            this.updateControllerLabels();
        };

        const rootSelect = document.getElementById('mode2-root');
        rootSelect.value = this.mode2State.rootNote;
        rootSelect.onchange = (e) => {
            this.mode2State.rootNote = e.target.value;
            this.renderMode2View();
            this.updateControllerLabels();
        };

        const octaveSelect = document.getElementById('mode2-octave');
        octaveSelect.value = String(this.mode2State.octave);
        octaveSelect.onchange = (e) => {
            this.mode2State.octave = parseInt(e.target.value, 10);
            this.renderMode2View();
            this.updateControllerLabels();
        };

        const scaleSelect = document.getElementById('mode2-scale');
        scaleSelect.value = this.mode2State.scale;
        scaleSelect.onchange = (e) => {
            this.mode2State.scale = e.target.value;
            this.renderMode2View();
            this.updateControllerLabels();
        };

        const dpadSelect = document.getElementById('mode2-dpad-mode');
        dpadSelect.value = this.mode2State.dpadMode;
        dpadSelect.onchange = (e) => {
            this.mode2State.dpadMode = e.target.value;
            this.renderMode2View();
            this.updateControllerLabels();
        };
    }

    switchMode(newMode) {
        this.soundEngine.stopAllVoices();
        this.mode = newMode;

        document.getElementById('tab-mode1').classList.toggle('active', newMode === 'mode1');
        document.getElementById('tab-mode2').classList.toggle('active', newMode === 'mode2');

        document.getElementById('panel-mode1').classList.toggle('hidden', newMode !== 'mode1');
        document.getElementById('panel-mode2').classList.toggle('hidden', newMode !== 'mode2');

        this.updateControllerLabels();
        this.preloadActiveInstruments();
    }

    preloadActiveInstruments() {
        if (this.mode === 'mode2') {
            this.soundEngine.preloadInstrument(this.mode2State.instrumentId);
        } else {
            const ids = new Set(Object.values(this.mode1Mappings).map(m => m.instrumentId));
            ids.forEach(id => this.soundEngine.preloadInstrument(id));
        }
    }

    /**
     * Computes the MIDI notes and instrument for any button press in the current mode
     */
    resolveButtonAction(btnId) {
        if (this.mode === 'mode1') {
            const map = this.mode1Mappings[btnId];
            if (!map) return null;
            const instInfo = GM_INSTRUMENTS.find(i => i.id === map.instrumentId);
            const isDrum = map.instrumentId.startsWith('drum_');

            if (isDrum) {
                return {
                    type: 'play',
                    instrumentId: map.instrumentId,
                    midiNotes: [instInfo?.drumMidi || 36],
                    displayLabel: instInfo ? instInfo.name.replace('Bateri: ', '') : map.instrumentId
                };
            }

            const baseMidi = this.soundEngine.noteToMidi(`${map.note}${map.octave}`) + this.accidentalSemitone;
            const chordObj = CHORD_TYPES[map.chord] || CHORD_TYPES.single;
            const midiNotes = chordObj.offsets.map(off => baseMidi + off);

            const preferFlats = this.accidentalSemitone < 0;
            const rootLabel = this.soundEngine.midiToTurkishName(baseMidi, preferFlats);

            return {
                type: 'play',
                instrumentId: map.instrumentId,
                midiNotes,
                displayLabel: `${rootLabel}${map.chord !== 'single' ? ' ' + chordObj.name.split(' ')[0] : ''}`
            };
        }

        // MODE 2: Direct 8-Button Scale Melodic + D-Pad 3-in-1
        const scaleObj = SCALES[this.mode2State.scale] || SCALES.major;
        const rootMidi = this.soundEngine.noteToMidi(`${this.mode2State.rootNote}${this.mode2State.octave}`);
        const preferFlats = this.accidentalSemitone < 0 || ['minor', 'hicaz', 'kurdi'].includes(this.mode2State.scale);

        // Check if button is one of the 8 main melodic buttons
        const mainIdx = this.mode2State.buttonOrder.indexOf(btnId);
        if (mainIdx !== -1) {
            const interval = scaleObj.intervals[mainIdx] ?? 0;
            const finalMidi = rootMidi + interval + this.accidentalSemitone;
            return {
                type: 'play',
                instrumentId: this.mode2State.instrumentId,
                midiNotes: [finalMidi],
                displayLabel: this.soundEngine.midiToTurkishName(finalMidi, preferFlats)
            };
        }

        // Otherwise it's a D-Pad button (up, down, left, right)
        if (DPAD_BUTTONS.includes(btnId)) {
            const dMode = this.mode2State.dpadMode;

            if (dMode === 'drums') {
                const drumId = this.mode2State.dpadDrums[btnId] || 'drum_kick';
                const instInfo = GM_INSTRUMENTS.find(i => i.id === drumId);
                return {
                    type: 'play',
                    instrumentId: drumId,
                    midiNotes: [instInfo?.drumMidi || 36],
                    displayLabel: instInfo ? instInfo.name.replace('Bateri: ', '') : drumId
                };
            }

            if (dMode === 'extra_notes') {
                const dpadOrder = ['left', 'down', 'right', 'up'];
                const dIdx = dpadOrder.indexOf(btnId);
                const extraInterval = scaleObj.dpadExtra[dIdx] ?? -5;
                const finalMidi = rootMidi + extraInterval + this.accidentalSemitone;
                return {
                    type: 'play',
                    instrumentId: this.mode2State.instrumentId,
                    midiNotes: [finalMidi],
                    displayLabel: this.soundEngine.midiToTurkishName(finalMidi, preferFlats)
                };
            }

            if (dMode === 'navigation') {
                return {
                    type: 'nav',
                    action: btnId
                };
            }
        }

        return null;
    }

    handleButtonDown(btnId, velocity = 0.88) {
        // Highlight on controller diagram & UI cards
        this.highlightButtonUI(btnId, true, velocity);

        const resolved = this.resolveButtonAction(btnId);
        if (!resolved) return;

        if (resolved.type === 'nav') {
            this.executeDpadNavigation(resolved.action);
            return;
        }

        // Play all MIDI notes for this button (1 note or chord)
        const nowSec = performance.now() / 1000;
        resolved.midiNotes.forEach((midi, idx) => {
            const voiceKey = `${btnId}_${idx}`;
            this.soundEngine.noteOn(voiceKey, resolved.instrumentId, midi, velocity);

            // Record if recording is active
            if (this.isRecording) {
                const relStart = Math.max(0, nowSec - this.recordStartTime);
                const ev = {
                    id: `${Date.now()}_${Math.random()}`,
                    trackIndex: this.currentTrackIndex,
                    buttonId: btnId,
                    instrumentId: resolved.instrumentId,
                    midiNote: midi,
                    velocity,
                    startTime: relStart,
                    duration: 0.25 // updated on button release
                };
                this.recordedEvents.push(ev);
                this.activeRecordingNotes.set(voiceKey, { event: ev, pressTime: nowSec });
                this.updateTrackStats();
            }
        });

        // Update Live Monitor Banner
        const instInfo = GM_INSTRUMENTS.find(i => i.id === resolved.instrumentId);
        const monitorNote = document.getElementById('live-note-display');
        const monitorInst = document.getElementById('live-inst-display');
        if (monitorNote) monitorNote.textContent = resolved.displayLabel;
        if (monitorInst) monitorInst.textContent = `${instInfo ? instInfo.icon + ' ' + instInfo.name : resolved.instrumentId} • Tuş Hızı: %${Math.round(velocity * 100)}`;
    }

    handleButtonUp(btnId) {
        this.highlightButtonUI(btnId, false, 0);

        const nowSec = performance.now() / 1000;
        for (let idx = 0; idx < 5; idx++) {
            const voiceKey = `${btnId}_${idx}`;
            this.soundEngine.noteOff(voiceKey);

            if (this.activeRecordingNotes.has(voiceKey)) {
                const rec = this.activeRecordingNotes.get(voiceKey);
                rec.event.duration = Math.max(0.08, nowSec - rec.pressTime);
                this.activeRecordingNotes.delete(voiceKey);
            }
        }
    }

    executeDpadNavigation(direction) {
        if (direction === 'up') {
            this.mode2State.octave = Math.min(6, this.mode2State.octave + 1);
            document.getElementById('mode2-octave').value = String(this.mode2State.octave);
            this.showToast(`Oktav Yükseltildi: Oktav ${this.mode2State.octave}`);
        } else if (direction === 'down') {
            this.mode2State.octave = Math.max(1, this.mode2State.octave - 1);
            document.getElementById('mode2-octave').value = String(this.mode2State.octave);
            this.showToast(`Oktav Düşürüldü: Oktav ${this.mode2State.octave}`);
        } else if (direction === 'left' || direction === 'right') {
            const melodicList = GM_INSTRUMENTS.filter(i => i.type === 'melodic');
            const curIdx = melodicList.findIndex(i => i.id === this.mode2State.instrumentId);
            const nextIdx = direction === 'right'
                ? (curIdx + 1) % melodicList.length
                : (curIdx - 1 + melodicList.length) % melodicList.length;
            this.mode2State.instrumentId = melodicList[nextIdx].id;
            document.getElementById('mode2-instrument').value = this.mode2State.instrumentId;
            this.soundEngine.preloadInstrument(this.mode2State.instrumentId);
            this.showToast(`Enstrüman: ${melodicList[nextIdx].name}`);
        }
        this.renderMode2View();
        this.updateControllerLabels();
    }

    /**
     * Right Joystick Handler: Sharp (# = +1 semitone) and Flat (b = -1 semitone)
     */
    handleRightStick(accidental, rx, ry) {
        this.accidentalSemitone = accidental;

        // Also bend any currently held note smoothly!
        this.soundEngine.setLivePitchBend(accidental);

        // Update UI accidental indicator
        document.getElementById('btn-acc-flat').classList.toggle('active', accidental === -1);
        document.getElementById('btn-acc-nat').classList.toggle('active', accidental === 0);
        document.getElementById('btn-acc-sharp').classList.toggle('active', accidental === 1);

        const badge = document.getElementById('accidental-live-badge');
        if (badge) {
            if (accidental === 1) {
                badge.textContent = '♯ DİYEZ AKTİF (+1 Yarım Ses)';
                badge.className = 'acc-badge sharp';
            } else if (accidental === -1) {
                badge.textContent = '♭ BEMOL AKTİF (-1 Yarım Ses)';
                badge.className = 'acc-badge flat';
            } else {
                badge.textContent = '♮ DOĞAL NOTA (Merkez)';
                badge.className = 'acc-badge natural';
            }
        }

        // Move SVG Right Stick dot
        const rStickDot = document.getElementById('svg-rstick');
        if (rStickDot) {
            const cx = 310 + rx * 14;
            const cy = 195 + ry * 14;
            rStickDot.setAttribute('cx', cx);
            rStickDot.setAttribute('cy', cy);
        }

        // Refresh displayed note names on Mode 2 cards & controller overlay
        if (this.mode === 'mode2') {
            this.renderMode2View();
        }
        this.updateControllerLabels();
    }

    /**
     * Left Joystick Handler: Live Studio Filter & Reverb Expression
     */
    handleLeftStick(lx, ly) {
        // Move SVG Left Stick dot
        const lStickDot = document.getElementById('svg-lstick');
        if (lStickDot) {
            const cx = 190 + lx * 14;
            const cy = 195 + ly * 14;
            lStickDot.setAttribute('cx', cx);
            lStickDot.setAttribute('cy', cy);
        }

        // Up/Down controls Filter Cutoff (parlaklık / boğukluk)
        if (Math.abs(ly) > 0.05) {
            // ly = -1 (up) -> 20000Hz, ly = +1 (down) -> 450Hz
            const norm = (1 - ly) / 2; // 0..1
            const freq = 350 * Math.pow(55, norm);
            this.soundEngine.setFilterCutoff(freq);
        } else {
            this.soundEngine.setFilterCutoff(18000);
        }

        // Left/Right controls Reverb wet mix
        if (Math.abs(lx) > 0.05) {
            const rev = Math.max(0, Math.min(0.85, 0.25 + lx * 0.45));
            this.soundEngine.setReverbAmount(rev);
            document.getElementById('slider-reverb').value = rev;
        }
    }

    handleUtilityButton(utilId) {
        if (utilId === 'share') {
            this.switchMode(this.mode === 'mode1' ? 'mode2' : 'mode1');
            this.showToast(`Mod Değiştirildi: ${this.mode === 'mode1' ? 'Mod 1 (Serbest Enstrüman Atama)' : 'Mod 2 (Doğrudan Nota Modu)'}`);
        } else if (utilId === 'options') {
            this.toggleRecording();
        }
    }

    /**
     * Renders Mode 1: 12-Button Custom Multi-Instrument & Note Assignment Grid
     */
    renderMode1Grid() {
        const container = document.getElementById('mode1-grid');
        container.innerHTML = '';

        for (const btn of CONTROLLER_BUTTONS) {
            const map = this.mode1Mappings[btn.id] || { instrumentId: 'acoustic_grand_piano', note: 'C', octave: 4, chord: 'single' };
            const isDrum = map.instrumentId.startsWith('drum_');

            const card = document.createElement('div');
            card.className = 'pad-card mode1-card';
            card.id = `card-mode1-${btn.id}`;
            card.style.setProperty('--pad-color', btn.color);

            // Build Instrument Select Options
            let instOptionsHtml = '';
            for (const inst of GM_INSTRUMENTS) {
                const selected = inst.id === map.instrumentId ? 'selected' : '';
                instOptionsHtml += `<option value="${inst.id}" ${selected}>${inst.icon} ${inst.name}</option>`;
            }

            // Build Note Select Options
            let noteOptionsHtml = '';
            for (const n of NOTE_NAMES) {
                const trName = TURKISH_NOTE_NAMES[n] || n;
                const selected = n === map.note ? 'selected' : '';
                noteOptionsHtml += `<option value="${n}" ${selected}>${trName} (${n})</option>`;
            }

            // Build Octave Options
            let octOptionsHtml = '';
            for (let oct = 1; oct <= 6; oct++) {
                const selected = oct === map.octave ? 'selected' : '';
                octOptionsHtml += `<option value="${oct}" ${selected}>Oktav ${oct}</option>`;
            }

            // Build Chord Options
            let chordOptionsHtml = '';
            for (const [cKey, cVal] of Object.entries(CHORD_TYPES)) {
                const selected = cKey === map.chord ? 'selected' : '';
                chordOptionsHtml += `<option value="${cKey}" ${selected}>${cVal.name}</option>`;
            }

            card.innerHTML = `
                <div class="pad-card-header">
                    <span class="btn-badge" style="background:${btn.color}">${btn.short}</span>
                    <div class="pad-title-wrap">
                        <strong>${btn.label}</strong>
                        <span class="kbd-hint">Klavye: [${btn.keyLabel}]</span>
                    </div>
                    <button class="btn-test-pad" data-test-btn="${btn.id}" title="Sesi Test Et">▶ Dinle</button>
                </div>
                <div class="pad-card-body">
                    <label class="field-label">Enstrüman / Ses Bankası</label>
                    <select class="pad-select inst-select" data-btn="${btn.id}">
                        ${instOptionsHtml}
                    </select>
                    <div class="pad-note-row ${isDrum ? 'disabled-row' : ''}">
                        <div>
                            <label class="field-label">Nota</label>
                            <select class="pad-select note-select" data-btn="${btn.id}" ${isDrum ? 'disabled' : ''}>
                                ${noteOptionsHtml}
                            </select>
                        </div>
                        <div>
                            <label class="field-label">Oktav</label>
                            <select class="pad-select oct-select" data-btn="${btn.id}" ${isDrum ? 'disabled' : ''}>
                                ${octOptionsHtml}
                            </select>
                        </div>
                        <div>
                            <label class="field-label">Çalma Tipi</label>
                            <select class="pad-select chord-select" data-btn="${btn.id}" ${isDrum ? 'disabled' : ''}>
                                ${chordOptionsHtml}
                            </select>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(card);
        }

        // Bind change events inside Mode 1 Grid
        container.querySelectorAll('.inst-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const bId = e.target.getAttribute('data-btn');
                this.mode1Mappings[bId].instrumentId = e.target.value;
                this.soundEngine.preloadInstrument(e.target.value);
                this.renderMode1Grid();
                this.updateControllerLabels();
            });
        });

        container.querySelectorAll('.note-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const bId = e.target.getAttribute('data-btn');
                this.mode1Mappings[bId].note = e.target.value;
                this.updateControllerLabels();
            });
        });

        container.querySelectorAll('.oct-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const bId = e.target.getAttribute('data-btn');
                this.mode1Mappings[bId].octave = parseInt(e.target.value, 10);
                this.updateControllerLabels();
            });
        });

        container.querySelectorAll('.chord-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const bId = e.target.getAttribute('data-btn');
                this.mode1Mappings[bId].chord = e.target.value;
                this.updateControllerLabels();
            });
        });

        container.querySelectorAll('.btn-test-pad').forEach(btn => {
            const bId = btn.getAttribute('data-test-btn');
            btn.addEventListener('mousedown', () => this.controller.triggerVirtualDown(bId));
            btn.addEventListener('mouseup', () => this.controller.triggerVirtualUp(bId));
            btn.addEventListener('mouseleave', () => this.controller.triggerVirtualUp(bId));
        });
    }

    /**
     * Renders Mode 2: 8-Note Direct Melodic Pads + D-Pad 4 Functional Pads
     */
    renderMode2View() {
        const mainGrid = document.getElementById('mode2-notes-grid');
        const dpadGrid = document.getElementById('mode2-dpad-grid');
        if (!mainGrid || !dpadGrid) return;

        mainGrid.innerHTML = '';
        dpadGrid.innerHTML = '';

        // 1. Render 8 Main Scale Note Pads
        this.mode2State.buttonOrder.forEach((btnId, idx) => {
            const btnMeta = CONTROLLER_BUTTONS.find(b => b.id === btnId);
            const resolved = this.resolveButtonAction(btnId);

            const card = document.createElement('div');
            card.className = 'note-pad-card';
            card.id = `card-mode2-${btnId}`;
            card.style.setProperty('--pad-color', btnMeta.color);

            card.innerHTML = `
                <div class="note-pad-top">
                    <span class="btn-badge" style="background:${btnMeta.color}">${btnMeta.short}</span>
                    <span class="degree-badge">${idx + 1}. Derece</span>
                    <span class="kbd-hint">[${btnMeta.keyLabel}]</span>
                </div>
                <div class="note-pad-center">
                    <div class="big-note-name">${resolved ? resolved.displayLabel.split(' ')[0] : 'Do4'}</div>
                    <div class="sub-note-intl">${resolved ? resolved.displayLabel : ''}</div>
                </div>
                <div class="note-pad-footer">
                    <span>${btnMeta.label}</span>
                </div>
            `;

            card.addEventListener('mousedown', () => this.controller.triggerVirtualDown(btnId));
            card.addEventListener('mouseup', () => this.controller.triggerVirtualUp(btnId));
            card.addEventListener('mouseleave', () => this.controller.triggerVirtualUp(btnId));

            mainGrid.appendChild(card);
        });

        // 2. Render 4 Left D-Pad Buttons according to chosen dpadMode
        const dpadDescriptions = {
            up: { nav: 'Oktav +1 (İnceleştir)' },
            down: { nav: 'Oktav -1 (Kalınlaştır)' },
            left: { nav: '◄ Önceki Enstrüman' },
            right: { nav: 'Sonraki Enstrüman ►' }
        };

        for (const btnId of DPAD_BUTTONS) {
            const btnMeta = CONTROLLER_BUTTONS.find(b => b.id === btnId);
            const resolved = this.resolveButtonAction(btnId);

            const card = document.createElement('div');
            card.className = 'note-pad-card dpad-card';
            card.id = `card-mode2-${btnId}`;
            card.style.setProperty('--pad-color', btnMeta.color);

            let centerTitle = '';
            let subTitle = '';

            if (this.mode2State.dpadMode === 'navigation') {
                centerTitle = dpadDescriptions[btnId].nav;
                subTitle = 'Canlı Kontrol Tuşu';
            } else if (this.mode2State.dpadMode === 'drums') {
                centerTitle = resolved ? resolved.displayLabel : 'Davul';
                subTitle = 'Bateri Eşlik Pedi';
            } else {
                centerTitle = resolved ? resolved.displayLabel.split(' ')[0] : 'Nota';
                subTitle = resolved ? `${resolved.displayLabel} (Ekstra Nota)` : '';
            }

            card.innerHTML = `
                <div class="note-pad-top">
                    <span class="btn-badge" style="background:${btnMeta.color}">${btnMeta.short}</span>
                    <span class="kbd-hint">[${btnMeta.keyLabel}]</span>
                </div>
                <div class="note-pad-center">
                    <div class="big-note-name" style="font-size:1.15rem">${centerTitle}</div>
                    <div class="sub-note-intl">${subTitle}</div>
                </div>
                <div class="note-pad-footer">
                    <span>${btnMeta.label}</span>
                </div>
            `;

            card.addEventListener('mousedown', () => this.controller.triggerVirtualDown(btnId));
            card.addEventListener('mouseup', () => this.controller.triggerVirtualUp(btnId));
            card.addEventListener('mouseleave', () => this.controller.triggerVirtualUp(btnId));

            dpadGrid.appendChild(card);
        }
    }

    /**
     * Updates the labels directly on the interactive PS5 DualSense SVG diagram
     */
    updateControllerLabels() {
        for (const btn of CONTROLLER_BUTTONS) {
            const labelEl = document.getElementById(`svg-label-${btn.id}`);
            if (!labelEl) continue;

            const resolved = this.resolveButtonAction(btn.id);
            if (!resolved) {
                labelEl.textContent = btn.short;
                continue;
            }

            if (resolved.type === 'nav') {
                const mapNav = { up: 'Oktav +1', down: 'Oktav -1', left: '◄ Enst.', right: 'Enst. ►' };
                labelEl.textContent = `${btn.short}: ${mapNav[btn.id]}`;
            } else {
                const shortDisp = resolved.displayLabel.split(' ')[0];
                labelEl.textContent = `${btn.short}: ${shortDisp}`;
            }
        }
    }

    highlightButtonUI(btnId, isPressed, velocity = 0.85) {
        const svgEl = document.getElementById(`svg-btn-${btnId}`);
        if (svgEl) {
            svgEl.classList.toggle('pressed', isPressed);
        }

        const c1 = document.getElementById(`card-mode1-${btnId}`);
        if (c1) c1.classList.toggle('active-hit', isPressed);

        const c2 = document.getElementById(`card-mode2-${btnId}`);
        if (c2) c2.classList.toggle('active-hit', isPressed);
    }

    updateControllerStatus(connected, name) {
        const badge = document.getElementById('controller-status');
        if (!badge) return;
        if (connected) {
            badge.textContent = `🎮 PS5 DualSense Bağlı (${name.slice(0, 28)})`;
            badge.className = 'status-pill status-ready';
        } else {
            badge.textContent = '🎮 PS5 Kolu Bekleniyor (Bir Tuşa Basın veya Klavye Kullanın)';
            badge.className = 'status-pill status-idle';
        }
    }

    // ================= RECORDING, MULTI-TRACK LOOPER & EXPORTS =================

    toggleRecording() {
        if (this.isRecording) {
            this.isRecording = false;
            document.getElementById('btn-record').classList.remove('recording');
            document.getElementById('btn-record').innerHTML = '⏺ Kaydı Başlat (Options)';
            this.showToast(`Kayıt tamamlandı! Toplam ${this.recordedEvents.length} nota kaydedildi.`);
        } else {
            this.soundEngine.init();
            this.isRecording = true;
            // If there are already events on previous tracks, start from 0 so user can overdub in sync!
            this.recordStartTime = performance.now() / 1000;
            if (this.recordedEvents.length > 0 && !this.isPlayingBack) {
                this.startOverdubPlayback();
            }
            document.getElementById('btn-record').classList.add('recording');
            document.getElementById('btn-record').innerHTML = '⏹ Kaydı Durdur';
            this.showToast(`Kanal ${this.currentTrackIndex} kaydı başladı! Şimdi çalabilirsiniz.`);
        }
        this.updateTrackStats();
    }

    startOverdubPlayback() {
        this.stopPlayback();
        this.isPlayingBack = true;
        for (const ev of this.recordedEvents) {
            const tId = setTimeout(() => {
                if (!this.isPlayingBack) return;
                const voiceKey = `play_${ev.id}`;
                this.soundEngine.noteOn(voiceKey, ev.instrumentId, ev.midiNote, ev.velocity);
                setTimeout(() => this.soundEngine.noteOff(voiceKey), (ev.duration || 0.3) * 1000);
            }, ev.startTime * 1000);
            this.playbackTimeouts.push(tId);
        }
    }

    togglePlayback() {
        if (this.isPlayingBack) {
            this.stopPlayback();
            return;
        }
        if (this.recordedEvents.length === 0) {
            this.showToast('Henüz kaydedilmiş nota yok. Önce Kaydı Başlatıp bir şeyler çalın!', true);
            return;
        }

        this.soundEngine.init();
        this.isPlayingBack = true;
        this.playbackStartTime = performance.now() / 1000;
        document.getElementById('btn-play').innerHTML = '⏹ Çalmayı Durdur';
        document.getElementById('btn-play').classList.add('active');

        const maxEnd = this.recordedEvents.reduce((m, e) => Math.max(m, e.startTime + (e.duration || 0.3)), 0);

        for (const ev of this.recordedEvents) {
            const tId = setTimeout(() => {
                if (!this.isPlayingBack) return;
                const voiceKey = `play_${ev.id}`;
                this.soundEngine.noteOn(voiceKey, ev.instrumentId, ev.midiNote, ev.velocity);
                this.highlightButtonUI(ev.buttonId, true, ev.velocity);
                setTimeout(() => {
                    this.soundEngine.noteOff(voiceKey);
                    this.highlightButtonUI(ev.buttonId, false, 0);
                }, (ev.duration || 0.3) * 1000);
            }, ev.startTime * 1000);
            this.playbackTimeouts.push(tId);
        }

        const endTimer = setTimeout(() => {
            this.stopPlayback();
        }, (maxEnd + 0.4) * 1000);
        this.playbackTimeouts.push(endTimer);
    }

    stopPlayback() {
        this.isPlayingBack = false;
        this.playbackTimeouts.forEach(t => clearTimeout(t));
        this.playbackTimeouts = [];
        this.soundEngine.stopAllVoices();
        const btn = document.getElementById('btn-play');
        if (btn) {
            btn.innerHTML = '▶ Kaydı Dinle';
            btn.classList.remove('active');
        }
    }

    addNewLayerTrack() {
        this.currentTrackIndex += 1;
        this.updateTrackStats();
        this.showToast(`Yeni Katman Açıldı: Kanal ${this.currentTrackIndex}. Önceki kanalların üstüne farklı enstrümanla kayıt yapabilirsiniz!`);
    }

    clearRecording() {
        this.stopPlayback();
        this.isRecording = false;
        this.recordedEvents = [];
        this.activeRecordingNotes.clear();
        this.currentTrackIndex = 1;
        document.getElementById('btn-record').classList.remove('recording');
        document.getElementById('btn-record').innerHTML = '⏺ Kaydı Başlat (Options)';
        this.updateTrackStats();
        this.showToast('Kayıt ve zaman çizelgesi temizlendi.');
    }

    toggleMetronome(forceState = null) {
        this.metronomeEnabled = forceState !== null ? forceState : !this.metronomeEnabled;
        const btn = document.getElementById('btn-metronome');
        btn.classList.toggle('active', this.metronomeEnabled);

        if (this.metronomeTimer) {
            clearInterval(this.metronomeTimer);
            this.metronomeTimer = null;
        }

        if (this.metronomeEnabled) {
            let beat = 0;
            const intervalMs = (60 / this.bpm) * 1000;
            this.soundEngine.playMetronomeClick(true);
            this.metronomeTimer = setInterval(() => {
                beat = (beat + 1) % 4;
                this.soundEngine.playMetronomeClick(beat === 0);
            }, intervalMs);
        }
    }

    updateTrackStats() {
        const countEl = document.getElementById('recorded-count');
        const trackEl = document.getElementById('active-track-badge');
        if (countEl) countEl.textContent = `${this.recordedEvents.length} Nota`;
        if (trackEl) trackEl.textContent = `Aktif Katman: Kanal ${this.currentTrackIndex}`;
    }

    async exportWAV() {
        if (this.recordedEvents.length === 0) {
            this.showToast('WAV olarak indirmek için önce birkaç nota kaydedin!', true);
            return;
        }
        try {
            this.showToast('WAV ses dosyası stüdyo kalitesinde işleniyor, lütfen bekleyin...');
            const wavBlob = await this.soundEngine.renderEventsToWavBlob(this.recordedEvents);
            this._triggerDownload(wavBlob, `dualsense_beste_${Date.now()}.wav`);
            this.showToast('✅ .WAV ses dosyası başarıyla indirildi!');
        } catch (err) {
            this.showToast(`WAV Hatası: ${err.message}`, true);
        }
    }

    exportMIDI() {
        if (this.recordedEvents.length === 0) {
            this.showToast('MIDI (.mid) olarak indirmek için önce birkaç nota kaydedin!', true);
            return;
        }
        try {
            const midiBlob = MidiExporter.exportToMidiBlob(this.recordedEvents, this.bpm);
            this._triggerDownload(midiBlob, `dualsense_beste_${Date.now()}.mid`);
            this.showToast('✅ Çok kanallı .MID (MIDI) dosyası başarıyla indirildi!');
        } catch (err) {
            this.showToast(`MIDI Hatası: ${err.message}`, true);
        }
    }

    _triggerDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 3000);
    }

    /**
     * Real-time Audio Spectrum & Piano Roll Canvas Visualizer
     */
    startVisualizers() {
        const specCanvas = document.getElementById('spectrum-canvas');
        const rollCanvas = document.getElementById('pianoroll-canvas');
        const specCtx = specCanvas ? specCanvas.getContext('2d') : null;
        const rollCtx = rollCanvas ? rollCanvas.getContext('2d') : null;

        const draw = () => {
            // 1. Audio Spectrum Visualizer
            if (specCtx && specCanvas) {
                const w = specCanvas.width;
                const h = specCanvas.height;
                specCtx.clearRect(0, 0, w, h);

                if (this.soundEngine.analyser) {
                    const freqData = new Uint8Array(this.soundEngine.analyser.frequencyBinCount);
                    this.soundEngine.analyser.getByteFrequencyData(freqData);
                    const bars = 48;
                    const barW = (w / bars) - 2;
                    for (let i = 0; i < bars; i++) {
                        const val = freqData[i * 2] || 0;
                        const barH = Math.max(3, (val / 255) * (h - 8));
                        const hue = 200 + (i / bars) * 110;
                        specCtx.fillStyle = `hsla(${hue}, 85%, 60%, 0.9)`;
                        specCtx.fillRect(i * (barW + 2), h - barH, barW, barH);
                    }
                }
            }

            // 2. Piano Roll Timeline Visualizer
            if (rollCtx && rollCanvas) {
                const w = rollCanvas.width;
                const h = rollCanvas.height;
                rollCtx.fillStyle = '#0d1322';
                rollCtx.fillRect(0, 0, w, h);

                // Grid lines
                rollCtx.strokeStyle = 'rgba(255,255,255,0.06)';
                rollCtx.lineWidth = 1;
                for (let x = 0; x < w; x += 60) {
                    rollCtx.beginPath();
                    rollCtx.moveTo(x, 0);
                    rollCtx.lineTo(x, h);
                    rollCtx.stroke();
                }

                const maxTime = Math.max(8, this.recordedEvents.reduce((m, e) => Math.max(m, e.startTime + (e.duration || 0.3)), 0) + 1);

                for (const ev of this.recordedEvents) {
                    const x = (ev.startTime / maxTime) * w;
                    const rw = Math.max(5, ((ev.duration || 0.25) / maxTime) * w);
                    const normNote = Math.max(0, Math.min(1, (ev.midiNote - 30) / 60));
                    const y = h - 10 - normNote * (h - 20);

                    const btnMeta = CONTROLLER_BUTTONS.find(b => b.id === ev.buttonId);
                    rollCtx.fillStyle = btnMeta ? btnMeta.color : '#38bdf8';
                    rollCtx.fillRect(x, y, rw, 7);
                }

                // Playhead line
                if (this.isRecording || this.isPlayingBack) {
                    const refStart = this.isRecording ? this.recordStartTime : this.playbackStartTime;
                    const elapsed = (performance.now() / 1000) - refStart;
                    const px = (elapsed / maxTime) * w;
                    rollCtx.strokeStyle = '#f43f5e';
                    rollCtx.lineWidth = 2;
                    rollCtx.beginPath();
                    rollCtx.moveTo(px, 0);
                    rollCtx.lineTo(px, h);
                    rollCtx.stroke();
                }
            }

            requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);
    }

    showToast(message, isError = false) {
        const toast = document.getElementById('studio-toast');
        if (!toast) return;
        toast.textContent = message;
        toast.className = `studio-toast show ${isError ? 'error' : ''}`;
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.studioApp = new StudioApp();
});
