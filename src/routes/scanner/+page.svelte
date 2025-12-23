<script lang="ts">
    import { goto } from "$app/navigation";
    import Quagga from "@ericblade/quagga2";
    import { onMount } from "svelte";

    let video: HTMLVideoElement;

    let isDetected: boolean = $state(false);
    let upcCode: string = $state("");
    let strm: MediaStream;
    let cam;

    $effect(() => {
        cam = navigator.mediaDevices
            .getUserMedia({
                video: {
                    facingMode: "environment",
                    frameRate: 60
                },
                audio: false,
            })
            .then((stream) => {
                video.srcObject = stream;
                strm = stream;
                video.play();
            });
    });

    onMount(() => {
        Quagga.init(
            {
                inputStream: {
                    type: "LiveStream",
                    target: video,
                },
                decoder: {
                    readers: ["upc_reader", "upc_e_reader"],
                },
            },
            (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("Scanner initialized.");
                Quagga.start();
            },
        );

        Quagga.onDetected((upc) => {
            upcCode = upc.codeResult.code!;
            isDetected = true;
        });

        Quagga.offDetected(() => {
            isDetected = false;
            upcCode = "";
        });
    });

    const scan = () => {
        if (isDetected && upcCode) {
            // strm.getTracks()[1].stop()
            Quagga.stop()
            video.pause();
            cam = null;
            goto("/result?upc=" + upcCode);
        }
    };
</script>

<main>
    <video bind:this={video}></video>
    <div class="scan-actions">
        <button class="btn-scan" disabled={!isDetected} onclick={scan}>
            <img src="" alt="" />
        </button>
        <button
            class="btn-cancel"
            onclick={() => {
                if (strm.getTracks()[1]) {
                    // strm.getTracks()[1].stop();
                    video.pause();
                    Quagga.stop()
                    goto("/");
                } else {
                    goto("/");
                }
            }}>Cancel</button
        >
    </div>
</main>

<style>
    :root {
        overflow: hidden;
    }

    main {
        background-color: black;
        height: 100dvh;
    }

    video {
        width: 100dvw;
        max-height: 500px;
        object-fit: cover;
        mask: linear-gradient(
            white,
            white,
            white,
            white,
            white,
            white,
            transparent
        );
    }

    .scan-actions {
        padding: 100px;
        display: flex;
        flex-direction: column;
        gap: 40px;
        justify-content: center;
    }

    .btn-scan {
        border: none;
        background-color: white;
        padding: 30px;
        outline-style: solid;
        outline-color: gainsboro;
        outline-width: 12px;
        width: 30px;
        height: 30px;
        border-radius: 100px;
        transition: 0.08s;
        margin-left: auto;
        margin-right: auto;
    }

    .btn-scan:active {
        scale: 95%;
        opacity: 60%;
    }

    .btn-scan:disabled {
        opacity: 50%;
    }

    .btn-cancel {
        background-color: rgb(45, 45, 45);
        color: rgb(252, 44, 79);
        border: none;
        padding: 12px;
        font-weight: 800;
        border-radius: 12px;
        transition: 0.08s;
    }

    .btn-cancel:active {
        scale: 95%;
        opacity: 60%;
    }
</style>
