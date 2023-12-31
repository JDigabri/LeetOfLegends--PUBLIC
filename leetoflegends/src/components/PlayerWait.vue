<template>
    <div class="master">
        <div class="playerJoinId">
            <p
                style="margin-left: 30px;font-family: 'Inter', sans-serif; font-size: 26px;font-weight: 200; color: var(--color-text);">
                Join via ID</p>
            <p class="gameid">{{ sessionId }} <svg @click="copyToClipboard" version="1.1" id="fi_126498"
                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 488.3 488.3" height="20px" width="20px" class="svginline"
                    style="enable-background:new 0 0 488.3 488.3;color: var(--color-text);fill: var(--color-text);margin-left: auto;"
                    xml:space="preserve">
                    <g>
                        <g>
                            <path d="M314.25,85.4h-227c-21.3,0-38.6,17.3-38.6,38.6v325.7c0,21.3,17.3,38.6,38.6,38.6h227c21.3,0,38.6-17.3,38.6-38.6V124
            			C352.75,102.7,335.45,85.4,314.25,85.4z M325.75,449.6c0,6.4-5.2,11.6-11.6,11.6h-227c-6.4,0-11.6-5.2-11.6-11.6V124
            			c0-6.4,5.2-11.6,11.6-11.6h227c6.4,0,11.6,5.2,11.6,11.6V449.6z"></path>
                            <path d="M401.05,0h-227c-21.3,0-38.6,17.3-38.6,38.6c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5c0-6.4,5.2-11.6,11.6-11.6h227
            			c6.4,0,11.6,5.2,11.6,11.6v325.7c0,6.4-5.2,11.6-11.6,11.6c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5c21.3,0,38.6-17.3,38.6-38.6
            			V38.6C439.65,17.3,422.35,0,401.05,0z"></path>
                        </g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                    <g>
                    </g>
                </svg></p>
        </div>
        <div v-if="showCopyMessage" class="copy-message">ID Copied!</div>

    </div>
</template>

<script>
export default {
    name: 'PlayerWait',
    props: {
        sessionId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            showCopyMessage: false
        }
    },
    methods: {
        copyToClipboard() {
            navigator.clipboard.writeText(this.sessionId)
                .then(() => {
                    this.showCopyMessage = true;
                    setTimeout(() => { this.showCopyMessage = false; }, 2000); // Message disappears after 2 seconds
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                });
        }
    }
}
</script>


<style scoped>
.playerJoinId {
    width: 500px;
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    margin-top: 3px;
    height: 150px;
    color: var(--color-text);
    box-shadow: 0px 4px 12px 2px rgba(0, 0, 0, 0.25);
}
.copy-message {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-background);
    color: var(--color-text);
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
    animation: fadeInOut 2s forwards;
  }

  @keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    10%, 90% { opacity: 1; }
  }
.master {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-background-mute);
}

.gameid {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    padding: 5px;
    font-weight: 300;
    border-radius: 5px;
    color: var(--color-text);
    background-color: var(--color-background-mute);
    border: 3px solid var(--color-background);
    margin-left: 25px;
    margin-bottom: 5px;
    width: 450px;
    display: flex;
    align-items: center;
}

.svginline {
    margin-left: auto;
    width: 20px;
    height: 20px;
    color: var(--color-text);
    fill: var(--color-text);
    transition: all 0.3s ease;
}

.svginline:hover {
    cursor: pointer;
    transform: scale(1.05);
}
</style>