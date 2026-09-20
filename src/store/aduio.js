import { create } from "zustand";
import { Howl, Howler } from 'howler';
import { blockSfxUrl } from '@/assets/blockAssets';

const SOUNDS = {
    roll: new Howl({ src: [blockSfxUrl], volume: 0.8 })
}

const AudioEngine = create((set, get) => {
    return {
        isMuted: false,
        globalVolume: 1.0,
        initAuduio: () => {
            Howler.autoUnlock = true;
        },
        playSFX: (name) => {
            console.log('sdhakhda');

            if (!SOUNDS[name]) return
            SOUNDS[name].play()
        }

    }
})


export default AudioEngine