// import Player from 'bitmovin-player/modules/bitmovinplayer-core';
// import PolyfillModule from 'bitmovin-player/modules/bitmovinplayer-polyfill';
// import EngineBitmovinModule from 'bitmovin-player/modules/bitmovinplayer-engine-bitmovin';
// import ContainerMp4Module from 'bitmovin-player/modules/bitmovinplayer-container-mp4';
// import ContainerTsModule from 'bitmovin-player/modules/bitmovinplayer-container-ts';
// import MseRendererModule from 'bitmovin-player/modules/bitmovinplayer-mserenderer';
// import AbrModule from 'bitmovin-player/modules/bitmovinplayer-abr';
// import DrmModule from 'bitmovin-player/modules/bitmovinplayer-drm';
// import XmlModule from 'bitmovin-player/modules/bitmovinplayer-xml';
// import DashModule from 'bitmovin-player/modules/bitmovinplayer-dash';
// import HlsModule from 'bitmovin-player/modules/bitmovinplayer-hls';
// import CryptoModule from 'bitmovin-player/modules/bitmovinplayer-crypto';
// import AdvertisingCoreModule from 'bitmovin-player/modules/bitmovinplayer-advertising-core';
// import AdvertisingBitmovinModule from 'bitmovin-player/modules/bitmovinplayer-advertising-bitmovin';
// import EngineNativeModule from 'bitmovin-player/modules/bitmovinplayer-engine-native';
// import StyleModule from 'bitmovin-player/modules/bitmovinplayer-style';
// import SubtitlesModule from 'bitmovin-player/modules/bitmovinplayer-subtitles';
// import SubtitlesVttModule from 'bitmovin-player/modules/bitmovinplayer-subtitles-vtt';
// import SubtitlesTtmlModule from 'bitmovin-player/modules/bitmovinplayer-subtitles-ttml';
// import SubtitlesCea608Module from 'bitmovin-player/modules/bitmovinplayer-subtitles-cea608';
// import SubtitlesNativeModule from 'bitmovin-player/modules/bitmovinplayer-subtitles-native';
// import ServiceWorkerClientModule from 'bitmovin-player/modules/bitmovinplayer-serviceworker-client';
// import PatchModule from 'bitmovin-player/modules/bitmovinplayer-patch';
// import { UIFactory } from 'bitmovin-player-ui';
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
    // preparePlayer();
    const playerElement = document.getElementById('player');
    window.bitmovin.player.Player.addModule(window.bitmovin.player['advertising-bitmovin'].default);
    const playerApi = new window.bitmovin.player.Player(playerElement, {
        key: BITMOVIN_LICENSE_KEY,
        // ui: false,
        playback: {
            autoplay: true,
            muted: true
        },
        logs: {
            bitmovin: false,
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
        title: "Getting Started with the Bitmovin Player",
        dash: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
        hls: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
        progressive: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/MI201109210084_mpeg-4_hd_high_1080p25_10mbits.mp4',
        poster: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/poster.jpg'
    };

    // UIFactory.buildDefaultUI(playerApi);

    playerApi.load(source).then(
        () => {
            console.log('Successfully created Bitmovin Player instance')
        },
        (reason) => {
            console.log('Error while creating Bitmovin Player instance', reason)
        }
    );
    playerApi.on('aderror', (event) => console.log(event));
    playerApi.on('moduleready', (event) => {
        if (event.name === 'Advertising') {
            const url = document.getElementById("vmapUrl").value;
            playerApi.ads.schedule({
                tag: {
                    url,
                    type: 'vmap',
                },
           },)
        }
    });
}

window.onload = () => {
    const applyButton = document.createElement("button");
    applyButton.addEventListener('click', setupPlayer);
    applyButton.innerText = "Apply";
    document.getElementById("controls").appendChild(applyButton);
}
