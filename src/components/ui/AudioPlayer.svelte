<script lang="ts">
  import { onMount } from "svelte";

  // Svelte 5: Define Props interface
  interface Chapter {
    title: string;
    time: number; // in seconds
  }

  interface Props {
    src: string;
    title?: string;
    chapters?: Chapter[];
  }

  // Svelte 5: Destructure props
  let { src, title = "Audio Sermon", chapters = [] } = $props<Props>();

  // Svelte 5: Reactive State
  let audio: HTMLAudioElement;
  let isPlaying = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);
  let volume = $state(1); // 0 to 1
  let isMuted = $state(false);
  let prevVolume = $state(1); // To remember volume before muting
  let isHoveringTimeline = $state(false);

  // Derived state for progress percentage
  let progress = $derived(duration ? (currentTime / duration) * 100 : 0);

  function togglePlay() {
    if (audio.paused) {
      audio.play();
      isPlaying = true;
    } else {
      audio.pause();
      isPlaying = false;
    }
  }

  function formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // Event Handlers
  function handleTimeUpdate() {
    currentTime = audio.currentTime;
  }

  function handleLoadedMetadata() {
    duration = audio.duration;
  }

  function handleSeek(e: Event) {
    const target = e.target as HTMLInputElement;
    const seekTime = (parseFloat(target.value) / 100) * duration;
    audio.currentTime = seekTime;
  }

  function handleChapterClick(time: number) {
    audio.currentTime = time;
    if (!isPlaying) togglePlay();
  }

  function handleVolumeChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const val = parseFloat(target.value);
    volume = val;
    audio.volume = volume;
    isMuted = val === 0;
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
      prevVolume = volume;
      volume = 0;
    } else {
      volume = prevVolume || 1;
    }
    audio.volume = volume;
  }

  function handleEnded() {
    isPlaying = false;
    currentTime = 0;
  }
</script>

<div class="w-full max-w-3xl mx-auto font-sans bg-white border border-stone-200 rounded-2xl shadow-lg overflow-hidden">
  
  <div class="p-6 pb-4">
    <div class="flex justify-between items-start mb-6">
      <div>
        <h2 class="text-xl font-bold text-stone-900 tracking-tight">{title}</h2>
        <p class="text-stone-500 text-sm font-medium mt-1">Audio Player</p>
      </div>
      <div class="px-3 py-1 bg-stone-100 rounded-md text-xs font-mono text-stone-600 border border-stone-200">
        {formatTime(currentTime)} <span class="text-stone-300">/</span> {formatTime(duration)}
      </div>
    </div>

    <div 
      class="relative w-full h-8 flex items-center group mb-6 select-none"
      onmouseenter={() => isHoveringTimeline = true}
      onmouseleave={() => isHoveringTimeline = false}
      role="group"
      aria-label="Audio Progress"
    >
      <div class="absolute w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
         </div>

      <div 
        class="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 bg-[#D4AF37] rounded-full pointer-events-none transition-all duration-100 ease-out"
        style="width: {progress}%"
      ></div>

      <div 
        class="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-[#D4AF37] border-2 border-white rounded-full shadow-md pointer-events-none transition-opacity duration-200 {isHoveringTimeline ? 'opacity-100' : 'opacity-0'}"
        style="left: {progress}%; transform: translate(-50%, -50%);"
      ></div>

      {#if duration > 0}
        {#each chapters as chapter}
          <div 
            class="absolute top-1/2 -translate-y-1/2 w-0.5 h-2.5 bg-white border-l border-stone-300 z-10 pointer-events-none"
            style="left: {(chapter.time / duration) * 100}%"
          ></div>
        {/each}
      {/if}

      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        oninput={handleSeek}
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        aria-label="Seek"
      />
    </div>

    <div class="flex items-center justify-between">
      
      <div class="flex items-center gap-4">
        <button 
          onclick={() => audio.currentTime = Math.max(0, currentTime - 10)}
          class="text-stone-400 hover:text-stone-800 transition-colors p-2"
          aria-label="Rewind 10 seconds"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.34l6.945 3.968c1.25.714 2.805-.188 2.805-1.628V8.688c0-1.44-1.555-2.342-2.805-1.628L12 11.03v-2.34c0-1.44-1.555-2.343-2.805-1.629l-7.108 4.062c-1.26.72-1.26 2.536 0 3.256l7.108 4.061z" />
          </svg>
        </button>

        <button
          onclick={togglePlay}
          class="w-14 h-14 flex items-center justify-center rounded-full bg-stone-900 text-[#D4AF37] hover:bg-stone-800 hover:scale-105 active:scale-95 transition-all shadow-md focus:outline-none focus:ring-4 focus:ring-stone-200"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {#if isPlaying}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
              <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clip-rule="evenodd" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 translate-x-0.5">
              <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
            </svg>
          {/if}
        </button>

        <button 
          onclick={() => audio.currentTime = Math.min(duration, currentTime + 10)}
          class="text-stone-400 hover:text-stone-800 transition-colors p-2"
          aria-label="Skip 10 seconds"
        >
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.062c-1.25-.713-2.805.19-2.805 1.629v2.34L5.055 7.06z" />
           </svg>
        </button>
      </div>

      <div class="flex items-center gap-2 group/volume relative">
        <button 
          onclick={toggleMute} 
          class="text-stone-400 hover:text-stone-600 p-2"
          aria-label="Mute toggle"
        >
          {#if volume === 0 || isMuted}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
               <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
               <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          {/if}
        </button>
        
        <div class="w-24 h-1.5 bg-stone-200 rounded-full relative overflow-hidden">
          <div 
             class="absolute top-0 left-0 h-full bg-stone-500 rounded-full pointer-events-none"
             style="width: {volume * 100}%"
          ></div>
          <input 
             type="range" 
             min="0" 
             max="1" 
             step="0.01"
             value={volume}
             oninput={handleVolumeChange}
             class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             aria-label="Volume"
          />
        </div>
      </div>
    </div>
  </div>

  {#if chapters.length > 0}
    <div class="bg-stone-50 border-t border-stone-200 px-6 py-4 max-h-48 overflow-y-auto custom-scrollbar">
      <h3 class="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Chapters</h3>
      <ul class="space-y-1">
        {#each chapters as chapter}
          <li>
            <button 
              onclick={() => handleChapterClick(chapter.time)}
              class="w-full flex items-center justify-between p-2 rounded-md hover:bg-white hover:shadow-sm text-left group transition-all"
            >
              <div class="flex items-center gap-3">
                 <div class="w-6 flex justify-center">
                    {#if currentTime >= chapter.time && (chapters[chapters.indexOf(chapter)+1] ? currentTime < chapters[chapters.indexOf(chapter)+1].time : true)}
                       <div class="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
                    {:else}
                       <span class="text-stone-300 text-xs font-mono group-hover:text-stone-500">{chapters.indexOf(chapter) + 1}</span>
                    {/if}
                 </div>
                 <span class="text-sm font-medium text-stone-700 group-hover:text-stone-900">{chapter.title}</span>
              </div>
              <span class="text-xs font-mono text-stone-400 group-hover:text-[#D4AF37]">{formatTime(chapter.time)}</span>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <audio
    bind:this={audio}
    {src}
    ontimeupdate={handleTimeUpdate}
    onloadedmetadata={handleLoadedMetadata}
    onended={handleEnded}
    class="hidden"
  ></audio>
</div>

<style>
    /* Optional: Custom Scrollbar for chapters list */
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #e7e5e4;
        border-radius: 20px;
    }
</style>
