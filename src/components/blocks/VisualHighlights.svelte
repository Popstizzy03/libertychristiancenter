<script lang="ts">
  interface Highlight {
    id: string;
    type: 'image' | 'video';
    src: string;
    poster?: string; // For video thumbnails
    title: string;
    category?: string;
    link?: string; // Optional link to a detailed page
  }

  let { items = [] } = $props<{ items: Highlight[] }>();
  
  let scrollContainer: HTMLElement;
  let showLeftArrow = $state(false);
  let showRightArrow = $state(true);

  function updateArrows() {
    if (!scrollContainer) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    showLeftArrow = scrollLeft > 0;
    showRightArrow = scrollLeft < scrollWidth - clientWidth - 10; // -10 for tolerance
  }

  function scroll(direction: 'left' | 'right') {
    if (!scrollContainer) return;
    const scrollAmount = scrollContainer.clientWidth * 0.8; // Scroll 80% of visible width
    const targetScroll = direction === 'left' 
      ? scrollContainer.scrollLeft - scrollAmount 
      : scrollContainer.scrollLeft + scrollAmount;
      
    scrollContainer.scrollTo({ left: targetScroll, behavior: 'smooth' });
  }
</script>

<div class="relative group">
  <!-- Header with navigation controls -->
  <div class="flex justify-between items-end mb-8 px-1">
    <div>
        <h3 class="font-serif text-3xl text-[#1E293B] font-bold">Life at Liberty</h3>
        <p class="text-slate-500 mt-2">Visual highlights from our recent gatherings and events.</p>
    </div>
    
    <div class="hidden md:flex gap-2">
      <button 
        onclick={() => scroll('left')}
        disabled={!showLeftArrow}
        class="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#FDFCF8] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Scroll left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button 
        onclick={() => scroll('right')}
        disabled={!showRightArrow}
        class="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#FDFCF8] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Scroll right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Scrolling Container -->
  <div 
    bind:this={scrollContainer}
    onscroll={updateArrows}
    class="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar"
  >
    {#each items as item}
      <div class="flex-none w-[85vw] md:w-[400px] snap-center group/card relative bg-white rounded-lg overflow-hidden shadow-sm border border-stone-100">
        <div class="aspect-[4/3] bg-slate-100 relative overflow-hidden">
            {#if item.type === 'video'}
                <img src={item.poster || item.src} alt={item.title} class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" />
                <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/card:bg-black/10 transition-colors">
                    <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-stone-900">
                            <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <span class="absolute top-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                    VIDEO
                </span>
            {:else}
                <img src={item.src} alt={item.title} class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" />
            {/if}
            
            {#if item.category}
                <span class="absolute top-3 left-3 bg-[#D4AF37] text-[#1E293B] text-xs font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider z-10">
                    {item.category}
                </span>
            {/if}

            {#if item.link}
                <a 
                    href={item.link}
                    class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover/card:opacity-100 transition-all duration-300 cursor-pointer z-20 backdrop-blur-[2px]"
                >
                    <div class="bg-[#D4AF37] text-[#1E293B] font-bold px-6 py-2 rounded-full shadow-lg transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                        <span>Read Story</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                            <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </a>
            {/if}
        </div>
        
        <div class="p-5">
            <h4 class="font-serif text-lg font-bold text-[#1E293B] mb-1">{item.title}</h4>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
