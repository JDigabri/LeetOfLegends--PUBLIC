<template>
    <div class="profileModal">
        <button style="align-self: flex-end; position: absolute;top: 0; right: 0;" @click="$emit('closeProf')">X</button>
        <div class="card1">
            <div class="profPic1"></div>
            <p style="font-size: 16px">{{ tagline }}</p>
            <p>{{ userName }}</p>
        </div>
        <div class="content">
            <div class="top">
            <div class="ProfilePictures">
                <p class="titles">Profile Picture</p>
            </div>
            <div class="ProfilePictures">
                <p class="titles">Taglines</p>
            </div>
            <div class="ProfilePictures">
                <p class="titles">Previous Games</p>
            </div>
            </div>
            <ProfilePictures />
        </div>
    </div>
    <div @click="$emit('closeProf')" class="profileModalBG"></div>
</template>

<script>
import ProfilePictures from './Modules/ProfilePictures.vue'

export default {
    name: 'ProfileModal',
    components: {
        ProfilePictures
    },
    props: {
        userName: {
            type: String,
            required: true
        },
        tagline: {
            type: String,
            required: true
        }
    },
    emits: ['closeProf'], // Declare the emitted events here
}
</script>

<style>
.profileModalBG {
    width: 100vw;
    height: 100vh;
    background-color: #00000035;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    color: var(--color-text);
    position: absolute;
    z-index: 5;
}

.profileModal {
    width: 800px;
    height: 600px;
    background-color: var(--color-background);
    display: flex;
    flex-direction: row;
    justify-content: start;
    font-family: 'Inter', sans-serif;
    color: var(--color-text);
    position: absolute;
    z-index: 6;
    border-radius: 5px;
    box-shadow: 0px 4px 12px 2px rgba(0, 0, 0, 0.25);
}

.card1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 270px;
    height: 400px;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    align-self: flex-start;
}

.profPic1 {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: #d9d9d9;
}

.content{
    display: flex;
    flex-direction: column;
    margin-top: 35px;
}

.top{
    display: flex;
    flex-direction: row;

}
.titles{
    font-size: 21px;
    font-weight: 200;
    margin-right: 25px;
    cursor: pointer;
}

.profilePictures{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    align-self: flex-start;
}
</style>
