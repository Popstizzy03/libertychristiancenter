<script lang="ts">
  import { onMount } from 'svelte';

  let { src, alt } = $props<{ src: string, alt: string }>();

  let isOpen = $state(false);
  let scale = $state(1);
  let isDragging = $state(false);
  let startX = 0;
  let startY = 0;
  let translateX = $state(0);
  let translateY = $state(0);
  let lastTranslateX = 0;
  let lastTranslateY = 0;

  function open() {
    isOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  function close() {
    isOpen = false;
    scale = 1;
    translateX = 0;
    translateY = 0;
    lastTranslateX = 0;
    lastTranslateY = 0;
    document.body.style.overflow = '';
  }

  function zoomIn(e: MouseEvent) {
    e.stopPropagation();
    scale = Math.min(scale + 0.5, 4);
  }

  function zoomOut(e: MouseEvent) {
    e.stopPropagation();
    scale = Math.max(scale - 0.5, 1);
    if (scale === 1) {
        translateX = 0;
        translateY = 0;
        lastTranslateX = 0;
        lastTranslateY = 0;
    }
  }

  function handleWheel(e: WheelEvent) {
      if (!isOpen) return;
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newScale = Math.min(Math.max(1, scale + delta), 4);
      scale = newScale;
      if (scale === 1) {
        translateX = 0;
        translateY = 0;
        lastTranslateX = 0;
        lastTranslateY = 0;
      }
  }

  function handleMouseDown(e: MouseEvent) {
      if (scale > 1) {
          isDragging = true;
          startX = e.clientX - lastTranslateX;
          startY = e.clientY - lastTranslateY;
          e.preventDefault(); // Prevent text selection
      }
  }

  function handleMouseMove(e: MouseEvent) {
      if (isDragging && scale > 1) {
          translateX = e.clientX - startX;
          translateY = e.clientY - startY;
      }
  }

  function handleMouseUp() {
      isDragging = false;
      lastTranslateX = translateX;
      lastTranslateY = translateY;
  }

  // Touch events for mobile pinch-to-zoom (basic implementation)
  // Ideally use a library like hammer.js for robust gestures, but simple drag is added here.
  
</script>

<!-- Trigger Image (Thumbnail) -->
<button 
    onclick={open} 
    class="block w-full h-full cursor-zoom-in overflow-hidden relative group"
    aria-label={`View full size image: ${alt}`}
>
    <img {src} {alt} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white drop-shadow-md">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
        </svg>
    </div>
</button>

<!-- Lightbox Modal -->
{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
        class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm"
        onclick={close}
        onwheel={handleWheel}
    >
        <!-- Controls -->
        <div class="absolute top-4 right-4 z-50 flex gap-4">
             <button onclick={zoomOut} class="text-white/70 hover:text-white bg-black/50 rounded-full p-2 transition-colors" aria-label="Zoom Out">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
                </svg>
            </button>
            <button onclick={zoomIn} class="text-white/70 hover:text-white bg-black/50 rounded-full p-2 transition-colors" aria-label="Zoom In">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                </svg>
            </button>
            <button onclick={close} class="text-white/70 hover:text-white bg-black/50 rounded-full p-2 transition-colors" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Image Container -->
        <div 
            class="relative w-full h-full flex items-center justify-center overflow-hidden"
            onclick={(e) => e.stopPropagation()}
        >
             <img 
                {src} 
                {alt} 
                class="max-w-full max-h-full object-contain transition-transform duration-100 ease-out select-none"
                style="transform: scale({scale}) translate({translateX}px, {translateY}px); cursor: {scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'}"
                onmousedown={handleMouseDown}
                onmousemove={handleMouseMove}
                onmouseup={handleMouseUp}
                onmouseleave={handleMouseUp}
                ondragstart={(e) => e.preventDefault()}
             />
        </div>
        
        <!-- Caption -->
        <div class="absolute bottom-6 left-0 w-full text-center pointer-events-none">
            <p class="text-white/90 font-serif text-lg drop-shadow-lg px-4">{alt}</p>
        </div>
    </div>
{/if}
