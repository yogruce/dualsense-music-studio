/**
 * DualSense Music Studio - PS5 DualSense Controller & Input Engine
 * Supports Gamepad API (USB & Bluetooth), WebHID Lightbar/Haptics,
 * Analog L2/R2 velocity sensitivity, Right Joystick Sharp(#)/Flat(b) detection,
 * Left Joystick FX modulation, and PC Keyboard fallback.
 */

const CONTROLLER_BUTTONS = [
    // Sağ Aksiyon Tuşları
    { id: 'cross', label: '✕ Çarpı', short: '✕', index: 0, key: 'KeyK', keyLabel: 'K', group: 'face', color: '#3b82f6' },
    { id: 'circle', label: '○ Yuvarlak', short: '○', index: 1, key: 'KeyL', keyLabel: 'L', group: 'face', color: '#ef4444' },
    { id: 'square', label: '□ Kare', short: '□', index: 2, key: 'KeyJ', keyLabel: 'J', group: 'face', color: '#ec4899' },
    { id: 'triangle', label: '△ Üçgen', short: '△', index: 3, key: 'KeyI', keyLabel: 'I', group: 'face', color: '#10b981' },

    // Omuz ve Tetik Tuşları (L1, R1, L2, R2)
    { id: 'l1', label: 'L1 Üst Sol', short: 'L1', index: 4, key: 'KeyQ', keyLabel: 'Q', group: 'shoulder', color: '#8b5cf6' },
    { id: 'r1', label: 'R1 Üst Sağ', short: 'R1', index: 5, key: 'KeyE', keyLabel: 'E', group: 'shoulder', color: '#06b6d4' },
    { id: 'l2', label: 'L2 Alt Sol Tetik', short: 'L2', index: 6, key: 'KeyU', keyLabel: 'U', group: 'trigger', color: '#a855f7' },
    { id: 'r2', label: 'R2 Alt Sağ Tetik', short: 'R2', index: 7, key: 'KeyO', keyLabel: 'O', group: 'trigger', color: '#14b8a6' },

    // Sol Yön Tuşları (D-Pad)
    { id: 'up', label: '▲ Yön Yukarı', short: '▲', index: 12, key: 'KeyW', keyLabel: 'W', group: 'dpad', color: '#f59e0b' },
    { id: 'down', label: '▼ Yön Aşağı', short: '▼', index: 13, key: 'KeyS', keyLabel: 'S', group: 'dpad', color: '#f97316' },
    { id: 'left', label: '◄ Yön Sol', short: '◄', index: 14, key: 'KeyA', keyLabel: 'A', group: 'dpad', color: '#eab308' },
    { id: 'right', label: '► Yön Sağ', short: '►', index: 15, key: 'KeyD', keyLabel: 'D', group: 'dpad', color: '#84cc16' }
];

// 8 Melodic Note Buttons used in Mode 2 (Direct Note Mode)
const MODE2_MAIN_BUTTONS = ['cross', 'circle', 'square', 'triangle', 'l1', 'r1', 'l2', 'r2'];
const DPAD_BUTTONS = ['up', 'down', 'left', 'right'];

class DualSenseController {
    constructor(callbacks = {}) {
        this.onButtonDown = callbacks.onButtonDown || (() => {});
        this.onButtonUp = callbacks.onButtonUp || (() => {});
        this.onRightStickChange = callbacks.onRightStickChange || (() => {});
        this.onLeftStickChange = callbacks.onLeftStickChange || (() => {});
        this.onUtilityButton = callbacks.onUtilityButton || (() => {});
        this.onConnectionChange = callbacks.onConnectionChange || (() => {});

        this.connected = false;
        this.gamepadIndex = null;
        this.gamepadName = '';

        // Button states: id -> { pressed: boolean, value: number }
        this.buttonStates = {};
        for (const b of CONTROLLER_BUTTONS) {
            this.buttonStates[b.id] = { pressed: false, value: 0 };
        }
        this.utilityStates = {
            share: false,
            options: false,
            l3: false,
            r3: false,
            touchpad: false
        };

        // Analog Stick States
        this.leftStick = { x: 0, y: 0 };
        this.rightStick = { x: 0, y: 0, accidentalState: 0 }; // -1 = Flat (b), 0 = Natural, +1 = Sharp (#)

        // Keyboard simulation state for Right Stick Sharp/Flat
        this.keyboardAccidental = 0; // LeftArrow / DownArrow = -1 (Bemol), RightArrow / UpArrow = +1 (Diyez)

        // Trigger threshold & velocity sensitivity
        this.triggerThreshold = 0.14;
        this.velocitySensitive = true;

        this._initListeners();
        this._startPolling();
    }

    _initListeners() {
        window.addEventListener('gamepadconnected', (e) => {
            this.gamepadIndex = e.gamepad.index;
            this.gamepadName = e.gamepad.id;
            this.connected = true;
            this.onConnectionChange(true, e.gamepad.id);
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            if (this.gamepadIndex === e.gamepad.index) {
                this.connected = false;
                this.gamepadIndex = null;
                this.onConnectionChange(false, '');
            }
        });

        // PC Keyboard bindings so user can play with keyboard or alongside controller
        window.addEventListener('keydown', (e) => {
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
            if (e.repeat) return;

            // Arrow keys simulate Right Joystick Sharp (#) and Flat (b)
            if (e.code === 'ArrowRight' || e.code === 'ArrowUp' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                e.preventDefault();
                this.keyboardAccidental = 1; // Diyez (#)
                this._updateRightStickAccidental(0.9, 0);
                return;
            }
            if (e.code === 'ArrowLeft' || e.code === 'ArrowDown' || e.code === 'ControlLeft' || e.code === 'AltLeft') {
                e.preventDefault();
                this.keyboardAccidental = -1; // Bemol (b)
                this._updateRightStickAccidental(-0.9, 0);
                return;
            }

            // Spacebar = Record toggle, Tab = Mode toggle
            if (e.code === 'Space') {
                e.preventDefault();
                this.onUtilityButton('options');
                return;
            }
            if (e.code === 'Tab') {
                e.preventDefault();
                this.onUtilityButton('share');
                return;
            }

            const btn = CONTROLLER_BUTTONS.find(b => b.key === e.code);
            if (btn) {
                e.preventDefault();
                const state = this.buttonStates[btn.id];
                if (!state.pressed) {
                    state.pressed = true;
                    state.value = 0.88;
                    this.onButtonDown(btn.id, 0.88, 'keyboard');
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

            if (['ArrowRight', 'ArrowUp', 'ShiftLeft', 'ShiftRight', 'ArrowLeft', 'ArrowDown', 'ControlLeft', 'AltLeft'].includes(e.code)) {
                this.keyboardAccidental = 0;
                this._updateRightStickAccidental(0, 0);
                return;
            }

            const btn = CONTROLLER_BUTTONS.find(b => b.key === e.code);
            if (btn) {
                const state = this.buttonStates[btn.id];
                if (state.pressed) {
                    state.pressed = false;
                    state.value = 0;
                    this.onButtonUp(btn.id, 'keyboard');
                }
            }
        });
    }

    _startPolling() {
        const poll = () => {
            this._pollGamepad();
            requestAnimationFrame(poll);
        };
        requestAnimationFrame(poll);
    }

    _pollGamepad() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        let gp = null;

        // Prefer DualSense / Wireless Controller if multiple gamepads exist
        for (const pad of gamepads) {
            if (!pad) continue;
            if (!gp) gp = pad;
            const idLower = pad.id.toLowerCase();
            if (idLower.includes('dualsense') || idLower.includes('054c') || idLower.includes('wireless controller') || idLower.includes('ps5')) {
                gp = pad;
                break;
            }
        }

        if (!gp) {
            if (this.connected) {
                this.connected = false;
                this.onConnectionChange(false, '');
            }
            return;
        }

        if (!this.connected) {
            this.connected = true;
            this.gamepadIndex = gp.index;
            this.gamepadName = gp.id;
            this.onConnectionChange(true, gp.id);
        }

        // 1. Poll 12 Main Assignable Buttons
        for (const btn of CONTROLLER_BUTTONS) {
            const gpBtn = gp.buttons[btn.index];
            if (!gpBtn) continue;

            const rawVal = typeof gpBtn.value === 'number' ? gpBtn.value : (gpBtn.pressed ? 1 : 0);
            const isTrigger = btn.group === 'trigger';
            const isPressed = isTrigger ? (rawVal >= this.triggerThreshold) : gpBtn.pressed;

            const prevState = this.buttonStates[btn.id];

            if (isPressed && !prevState.pressed) {
                prevState.pressed = true;
                // Velocity calculation: for L2/R2 use pressure (or minimum 0.55 so light taps are still audible)
                const velocity = (isTrigger && this.velocitySensitive)
                    ? Math.min(1.0, Math.max(0.55, rawVal * 1.15))
                    : 0.9;
                prevState.value = velocity;
                this.onButtonDown(btn.id, velocity, 'gamepad');
            } else if (!isPressed && prevState.pressed) {
                prevState.pressed = false;
                prevState.value = 0;
                this.onButtonUp(btn.id, 'gamepad');
            } else if (isPressed) {
                prevState.value = rawVal;
            }
        }

        // 2. Poll Utility Buttons (Share=8, Options=9, L3=10, R3=11, Touchpad=17)
        const utilMap = [
            { id: 'share', idx: 8 },
            { id: 'options', idx: 9 },
            { id: 'l3', idx: 10 },
            { id: 'r3', idx: 11 },
            { id: 'touchpad', idx: 17 }
        ];
        for (const u of utilMap) {
            const b = gp.buttons[u.idx];
            const pressed = b ? b.pressed : false;
            if (pressed && !this.utilityStates[u.id]) {
                this.utilityStates[u.id] = true;
                this.onUtilityButton(u.id);
            } else if (!pressed && this.utilityStates[u.id]) {
                this.utilityStates[u.id] = false;
            }
        }

        // 3. Poll Right Analog Stick (Axes 2 & 3) -> Sharp (#) and Flat (b)
        const rx = this._applyDeadzone(gp.axes[2] || 0, 0.15);
        const ry = this._applyDeadzone(gp.axes[3] || 0, 0.15);
        if (this.keyboardAccidental === 0) {
            this._updateRightStickAccidental(rx, ry);
        }

        // 4. Poll Left Analog Stick (Axes 0 & 1) -> Live Filter / Reverb FX
        const lx = this._applyDeadzone(gp.axes[0] || 0, 0.15);
        const ly = this._applyDeadzone(gp.axes[1] || 0, 0.15);
        if (Math.abs(lx - this.leftStick.x) > 0.02 || Math.abs(ly - this.leftStick.y) > 0.02) {
            this.leftStick.x = lx;
            this.leftStick.y = ly;
            this.onLeftStickChange(lx, ly);
        }
    }

    _applyDeadzone(val, dz = 0.15) {
        if (Math.abs(val) < dz) return 0;
        return val;
    }

    /**
     * Right Stick Accidental Logic:
     * - Pushing Right (rx > 0.35) or Up (ry < -0.35) => +1 Semitone (Diyez / #)
     * - Pushing Left (rx < -0.35) or Down (ry > 0.35) => -1 Semitone (Bemol / b)
     * - Centered => 0 Semitone (Natural)
     */
    _updateRightStickAccidental(rx, ry) {
        let newAccidental = 0;
        const threshold = 0.36;

        // Horizontal axis takes priority, or vertical axis if pushed strongly up/down
        if (rx > threshold || (Math.abs(rx) <= threshold && ry < -threshold)) {
            newAccidental = 1; // Diyez (#)
        } else if (rx < -threshold || (Math.abs(rx) <= threshold && ry > threshold)) {
            newAccidental = -1; // Bemol (b)
        }

        const changed = (
            newAccidental !== this.rightStick.accidentalState ||
            Math.abs(rx - this.rightStick.x) > 0.03 ||
            Math.abs(ry - this.rightStick.y) > 0.03
        );

        this.rightStick.x = rx;
        this.rightStick.y = ry;
        this.rightStick.accidentalState = newAccidental;

        if (changed) {
            this.onRightStickChange(newAccidental, rx, ry);
        }
    }

    /**
     * Trigger virtual button press from UI click/touch
     */
    triggerVirtualDown(btnId) {
        const state = this.buttonStates[btnId];
        if (state && !state.pressed) {
            state.pressed = true;
            state.value = 0.9;
            this.onButtonDown(btnId, 0.9, 'mouse');
        }
    }

    triggerVirtualUp(btnId) {
        const state = this.buttonStates[btnId];
        if (state && state.pressed) {
            state.pressed = false;
            state.value = 0;
            this.onButtonUp(btnId, 'mouse');
        }
    }
}

window.CONTROLLER_BUTTONS = CONTROLLER_BUTTONS;
window.MODE2_MAIN_BUTTONS = MODE2_MAIN_BUTTONS;
window.DPAD_BUTTONS = DPAD_BUTTONS;
window.DualSenseController = DualSenseController;
