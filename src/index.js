import Player from 'bitmovin-player/modules/bitmovinplayer-core';
import PolyfillModule from 'bitmovin-player/modules/bitmovinplayer-polyfill';
import EngineBitmovinModule from 'bitmovin-player/modules/bitmovinplayer-engine-bitmovin';
import ContainerMp4Module from 'bitmovin-player/modules/bitmovinplayer-container-mp4';
import ContainerTsModule from 'bitmovin-player/modules/bitmovinplayer-container-ts';
import MseRendererModule from 'bitmovin-player/modules/bitmovinplayer-mserenderer';
import AbrModule from 'bitmovin-player/modules/bitmovinplayer-abr';
import DrmModule from 'bitmovin-player/modules/bitmovinplayer-drm';
import XmlModule from 'bitmovin-player/modules/bitmovinplayer-xml';
import DashModule from 'bitmovin-player/modules/bitmovinplayer-dash';
import HlsModule from 'bitmovin-player/modules/bitmovinplayer-hls';
import CryptoModule from 'bitmovin-player/modules/bitmovinplayer-crypto';
import AdvertisingCoreModule from 'bitmovin-player/modules/bitmovinplayer-advertising-core';
import AdvertisingBitmovinModule from 'bitmovin-player/modules/bitmovinplayer-advertising-bitmovin';
import EngineNativeModule from 'bitmovin-player/modules/bitmovinplayer-engine-native';
import StyleModule from 'bitmovin-player/modules/bitmovinplayer-style';
import SubtitlesModule from 'bitmovin-player/modules/bitmovinplayer-subtitles';
import SubtitlesVttModule from 'bitmovin-player/modules/bitmovinplayer-subtitles-vtt';
import SubtitlesTtmlModule from 'bitmovin-player/modules/bitmovinplayer-subtitles-ttml';
import SubtitlesCea608Module from 'bitmovin-player/modules/bitmovinplayer-subtitles-cea608';
import SubtitlesNativeModule from 'bitmovin-player/modules/bitmovinplayer-subtitles-native';
import ServiceWorkerClientModule from 'bitmovin-player/modules/bitmovinplayer-serviceworker-client';
import PatchModule from 'bitmovin-player/modules/bitmovinplayer-patch';
import { UIFactory } from 'bitmovin-player-ui';
const { BITMOVIN_LICENSE_KEY } = process.env;

const preparePlayer = () => {
    Player.addModule(PolyfillModule);
    Player.addModule(EngineBitmovinModule);
    Player.addModule(MseRendererModule);
    Player.addModule(ContainerMp4Module);
    Player.addModule(ContainerTsModule);
    Player.addModule(AbrModule);
    Player.addModule(DrmModule);
    Player.addModule(XmlModule);
    Player.addModule(DashModule);
    Player.addModule(HlsModule);
    Player.addModule(CryptoModule);
    Player.addModule(EngineNativeModule);
    Player.addModule(AdvertisingCoreModule);
    Player.addModule(AdvertisingBitmovinModule);
    Player.addModule(StyleModule);
    Player.addModule(SubtitlesModule);
    Player.addModule(SubtitlesVttModule);
    Player.addModule(SubtitlesTtmlModule);
    Player.addModule(SubtitlesCea608Module);
    Player.addModule(SubtitlesNativeModule);
    Player.addModule(ServiceWorkerClientModule);
    Player.addModule(PatchModule);}

const setupPlayer = () => {
    preparePlayer();
    const playerElement = document.getElementById('player');

    const playerApi = new Player(playerElement, {
        key: BITMOVIN_LICENSE_KEY,
        ui: false,
        playback: {
            autoplay: true,
            muted: true
        },
        logs: {
            bitmovin: true,
            level: 'debug'
        },
        advertising: {
            adBreaks: [],
            withCredentials: false,
            strategy: {
                shouldPlayAdBreak: (toPlay) => {
                    // when resuming a previously watched video only show pre adbreaks
                    return !(
                        toPlay?.scheduleTime < 0 &&
                        toPlay?.position !== 'pre'
                    );
                },
                shouldPlaySkippedAdBreaks: (skipped) => {
                    // scrubbing over multiple adbreaks will only play last one
                    return skipped.length ? [skipped[skipped.length - 1]] : skipped;
                }
            }
        }
    });
    const source = {
        dash: 'https://media.axprod.net/TestVectors/v6.1-MultiDRM/Manifest_1080p.mpd',
        drm: {
            playready: {
                LA_URL: 'https://drm-playready-licensing.axtest.net/AcquireLicense',
                utf8message: true,
                plaintextChallenge: true,
                headers: { 'Content-Type': 'text/xml', 'X-AxDRM-Message': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiNjllNTQwODgtZTllMC00NTMwLThjMWEtMWViNmRjZDBkMTRlIiwibWVzc2FnZSI6eyJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsImtleXMiOlt7ImlkIjoiNmU1YTFkMjYtMjc1Ny00N2Q3LTgwNDYtZWFhNWQxZDM0YjVhIn1dfX0.yF7PflOPv9qHnu3ZWJNZ12jgkqTabmwXbDWk_47tLNE',
                }
            },
            widevine: {
                LA_URL: 'https://drm-widevine-licensing.axtest.net/AcquireLicense',
                utf8message: true,
                plaintextChallenge: true,
                headers: { 'Content-Type': 'text/xml', 'X-AxDRM-Message': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiNjllNTQwODgtZTllMC00NTMwLThjMWEtMWViNmRjZDBkMTRlIiwibWVzc2FnZSI6eyJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsImtleXMiOlt7ImlkIjoiNmU1YTFkMjYtMjc1Ny00N2Q3LTgwNDYtZWFhNWQxZDM0YjVhIn1dfX0.yF7PflOPv9qHnu3ZWJNZ12jgkqTabmwXbDWk_47tLNE',
                }
            }
        }
    };

    UIFactory.buildDefaultUI(playerApi);

    playerApi.load(source).then(
        () => {
            console.log('Successfully created Bitmovin Player instance', source)
        },
        (reason) => {
            console.log('Error while creating Bitmovin Player instance', reason)
        }
    );
    playerApi.getSupportedDRM().then(drms => console.log(drms));
    playerApi.on('moduleready', (event) => {
        if (event.name === 'Advertising') {
            playerApi.ads.schedule({
                tag: {
                    url: `${document.location.href}vmap-skyq.xml`,
                    type: 'vmap',
                },
           });
        }
    });
}

window.onload = () => {
    setupPlayer();
}
