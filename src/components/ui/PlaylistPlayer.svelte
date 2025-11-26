<script lang="ts">
  import AudioPlayer from "./AudioPlayer.svelte";

  interface Sermon {
    title: string;
    src: string;
    chapters?: { title: string; time: number }[];
  }

  interface Props {
    playlist: Sermon[];
  }

  let { playlist = [] } = $props<Props>();

  let currentIndex = $state(0);

  // Derived current sermon object
  let currentSermon = $derived(playlist[currentIndex]);

  function handleNext() {
    if (currentIndex < playlist.length - 1) {
      currentIndex++;
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      currentIndex--;
    }
  }

  function handleSelect(index: number) {
    currentIndex = index;
  }
</script>

<div class="space-y-6">
  {#if currentSermon}
    <!-- Main Player Wrapper -->
    <div class="relative">
      <AudioPlayer
        key={currentSermon.src}
        src={currentSermon.src}
        title={currentSermon.title}
        chapters={currentSermon.chapters}
        
      />
      
      <!-- Playlist Controls (Previous/Next) -->
      <div class="flex justify-between mt-4 px-2">
         <button 
            onclick={handlePrevious}
            disabled={currentIndex === 0}
            class="text-sm font-medium text-stone-500 hover:text-[#D4AF37] disabled:opacity-30 disabled:hover:text-stone-500 transition-colors flex items-center gap-1"
         >
            ← Previous Message
         </button>
         
         <button 
            onclick={handleNext}
            disabled={currentIndex === playlist.length - 1}
            class="text-sm font-medium text-stone-500 hover:text-[#D4AF37] disabled:opacity-30 disabled:hover:text-stone-500 transition-colors flex items-center gap-1"
         >
            Next Message →
         </button>
      </div>
    </div>
  {/if}

  <!-- Playlist List -->
  {#if playlist.length > 1}
    <div class="bg-stone-50 border border-stone-200 rounded-xl p-4">
      <h3 class="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 ml-2">Up Next</h3>
      <ul class="space-y-2">
        {#each playlist as sermon, index}
          <li>
            <button
              onclick={() => handleSelect(index)}
              class="w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 {index === currentIndex ? 'bg-white shadow-sm border border-stone-100 ring-1 ring-[#D4AF37]/20' : 'hover:bg-stone-100 hover:text-stone-800 text-stone-600'}"
            >
               <div class="w-8 flex justify-center shrink-0">
                 {#if index === currentIndex}
                   <div class="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                 {:else}
                   <span class="text-xs font-mono text-stone-400">{index + 1}</span>
                 {/if}
               </div>
               <div class="min-w-0">
                  <p class="text-sm font-medium truncate {index === currentIndex ? 'text-stone-900' : ''}">{sermon.title}</p>
               </div>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
