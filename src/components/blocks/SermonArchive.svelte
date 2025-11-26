<script lang="ts">
  import { onMount } from 'svelte';

  export let sermons: any[] = [];

  let searchQuery = "";
  let selectedSeries = "";
  let selectedPreacher = "";
  let selectedYear = "";

  // Dropdown visibility state
  let isOpenSeries = false;
  let isOpenPreacher = false;
  let isOpenYear = false;

  // Refs for click-outside handling
  let seriesDropdownRef: HTMLElement;
  let preacherDropdownRef: HTMLElement;
  let yearDropdownRef: HTMLElement;

  // Extract unique options
  $: allSeries = [...new Set(sermons.map(s => s.data.series).filter(Boolean))].sort();
  $: allPreachers = [...new Set(sermons.map(s => s.data.preacher).filter(Boolean))].sort();
  $: allYears = [...new Set(sermons.map(s => new Date(s.data.date).getFullYear()))].sort((a, b) => b - a);

  // Filter logic
  $: filteredSermons = sermons.filter((sermon) => {
    const matchesSearch = 
      sermon.data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sermon.data.messageTitle && sermon.data.messageTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sermon.data.scripture.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.data.preacher.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeries = selectedSeries ? sermon.data.series === selectedSeries : true;
    const matchesPreacher = selectedPreacher ? sermon.data.preacher === selectedPreacher : true;
    const matchesYear = selectedYear ? new Date(sermon.data.date).getFullYear().toString() === selectedYear.toString() : true;

    return matchesSearch && matchesSeries && matchesPreacher && matchesYear;
  });

  function formatDate(dateStr: string | Date) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
  }

  function toggleSeriesDropdown() {
      isOpenSeries = !isOpenSeries;
      if (isOpenSeries) {
          isOpenPreacher = false;
          isOpenYear = false;
      }
  }

  function togglePreacherDropdown() {
      isOpenPreacher = !isOpenPreacher;
      if (isOpenPreacher) {
          isOpenSeries = false;
          isOpenYear = false;
      }
  }

  function toggleYearDropdown() {
      isOpenYear = !isOpenYear;
      if (isOpenYear) {
          isOpenSeries = false;
          isOpenPreacher = false;
      }
  }

  function selectSeries(series: string) {
      selectedSeries = series;
      isOpenSeries = false;
  }

  function selectPreacher(preacher: string) {
      selectedPreacher = preacher;
      isOpenPreacher = false;
  }

  function selectYear(year: string) {
      selectedYear = year;
      isOpenYear = false;
  }

  // Handle click outside to close dropdowns
  function handleClickOutside(event: MouseEvent) {
    if (seriesDropdownRef && !seriesDropdownRef.contains(event.target as Node)) {
      isOpenSeries = false;
    }
    if (preacherDropdownRef && !preacherDropdownRef.contains(event.target as Node)) {
      isOpenPreacher = false;
    }
    if (yearDropdownRef && !yearDropdownRef.contains(event.target as Node)) {
      isOpenYear = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="space-y-8">
  <!-- Search and Filter Controls -->
  <div class="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Search Input -->
      <div>
        <label for="search" class="block text-sm font-medium text-stone-700 mb-1">Search</label>
        <input
          type="text"
          id="search"
          bind:value={searchQuery}
          placeholder="Title, scripture, or preacher..."
          class="w-full rounded-md border-stone-300 shadow-sm focus:border-[#D4AF37] focus:ring focus:ring-[#D4AF37] focus:ring-opacity-50 px-3 py-2 border bg-white"
        />
      </div>

      <!-- Series Filter (Custom Dropdown) -->
      <div class="relative" bind:this={seriesDropdownRef}>
        <label for="series-trigger" class="block text-sm font-medium text-stone-700 mb-1">Filter by Series</label>
        <button
          id="series-trigger"
          type="button"
          on:click={toggleSeriesDropdown}
          class="w-full bg-white rounded-md border border-stone-300 shadow-sm px-3 py-2 text-left focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] flex justify-between items-center"
        >
          <span class="block truncate">{selectedSeries || "All Series"}</span>
          <svg class="h-5 w-5 text-stone-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </button>

        {#if isOpenSeries}
          <div class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
             <button
                type="button"
                class="text-stone-900 relative cursor-pointer select-none py-2 pl-3 pr-9 w-full text-left hover:bg-stone-100 transition-colors {selectedSeries === "" ? 'font-semibold bg-stone-50' : ''}"
                on:click={() => selectSeries("")}
              >
                All Series
                {#if selectedSeries === ""}
                   <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-[#D4AF37]">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                  </span>
                {/if}
              </button>
            {#each allSeries as series}
              <button
                type="button"
                class="text-stone-900 relative cursor-pointer select-none py-2 pl-3 pr-9 w-full text-left hover:bg-stone-100 transition-colors {selectedSeries === series ? 'font-semibold bg-stone-50' : ''}"
                on:click={() => selectSeries(series)}
              >
                {series}
                {#if selectedSeries === series}
                  <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-[#D4AF37]">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                  </span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Preacher Filter (Custom Dropdown) -->
      <div class="relative" bind:this={preacherDropdownRef}>
        <label for="preacher-trigger" class="block text-sm font-medium text-stone-700 mb-1">Filter by Preacher</label>
        <button
          id="preacher-trigger"
          type="button"
          on:click={togglePreacherDropdown}
          class="w-full bg-white rounded-md border border-stone-300 shadow-sm px-3 py-2 text-left focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] flex justify-between items-center"
        >
          <span class="block truncate">{selectedPreacher || "All Preachers"}</span>
           <svg class="h-5 w-5 text-stone-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </button>

        {#if isOpenPreacher}
          <div class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <button
                type="button"
                class="text-stone-900 relative cursor-pointer select-none py-2 pl-3 pr-9 w-full text-left hover:bg-stone-100 transition-colors {selectedPreacher === "" ? 'font-semibold bg-stone-50' : ''}"
                on:click={() => selectPreacher("")}
              >
                All Preachers
                 {#if selectedPreacher === ""}
                   <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-[#D4AF37]">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                  </span>
                {/if}
              </button>
            {#each allPreachers as preacher}
              <button
                type="button"
                class="text-stone-900 relative cursor-pointer select-none py-2 pl-3 pr-9 w-full text-left hover:bg-stone-100 transition-colors {selectedPreacher === preacher ? 'font-semibold bg-stone-50' : ''}"
                on:click={() => selectPreacher(preacher)}
              >
                {preacher}
                 {#if selectedPreacher === preacher}
                  <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-[#D4AF37]">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                  </span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Year Filter (Custom Dropdown) -->
      <div class="relative" bind:this={yearDropdownRef}>
        <label for="year-trigger" class="block text-sm font-medium text-stone-700 mb-1">Filter by Year</label>
        <button
          id="year-trigger"
          type="button"
          on:click={toggleYearDropdown}
          class="w-full bg-white rounded-md border border-stone-300 shadow-sm px-3 py-2 text-left focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] flex justify-between items-center"
        >
          <span class="block truncate">{selectedYear || "All Years"}</span>
           <svg class="h-5 w-5 text-stone-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </button>

        {#if isOpenYear}
          <div class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <button
                type="button"
                class="text-stone-900 relative cursor-pointer select-none py-2 pl-3 pr-9 w-full text-left hover:bg-stone-100 transition-colors {selectedYear === "" ? 'font-semibold bg-stone-50' : ''}"
                on:click={() => selectYear("")}
              >
                All Years
                 {#if selectedYear === ""}
                   <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-[#D4AF37]">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                  </span>
                {/if}
              </button>
            {#each allYears as year}
              <button
                type="button"
                class="text-stone-900 relative cursor-pointer select-none py-2 pl-3 pr-9 w-full text-left hover:bg-stone-100 transition-colors {selectedYear === year.toString() ? 'font-semibold bg-stone-50' : ''}"
                on:click={() => selectYear(year.toString())}
              >
                {year}
                 {#if selectedYear === year.toString()}
                  <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-[#D4AF37]">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                  </span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Results Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {#if filteredSermons.length === 0}
        <div class="col-span-full text-center py-12 text-stone-500">
            No sermons found matching your criteria.
        </div>
    {/if}

    {#each filteredSermons as sermon (sermon.slug)}
      <a
        href={`/sermons/${sermon.slug}`}
        class="block bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
      >
        <!-- Image Slot -->
        {#if sermon.data.youtube_id}
            <div class="aspect-video bg-stone-200 relative group-hover:brightness-95 transition-all">
                <img
                    src={`https://img.youtube.com/vi/${sermon.data.youtube_id}/maxresdefault.jpg`}
                    alt={sermon.data.title}
                    class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-stone-900">
                            <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
        {:else}
             <div class="aspect-video bg-stone-800 flex items-center justify-center text-stone-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
             </div>
        {/if}

        <!-- Content Slot -->
        <div class="p-6 flex flex-col h-full">
            <div class="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
                {sermon.data.series || "Sermon"}
            </div>
            <h3 class="text-xl font-bold text-stone-900 mb-2 line-clamp-2">
                {sermon.data.title}
            </h3>
            <div class="text-sm text-stone-500 mb-4 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" />
                </svg>
                {formatDate(sermon.data.date)}
            </div>
            <div class="text-sm text-stone-600 line-clamp-3">
                {sermon.data.preacher} &bull; {sermon.data.scripture}
            </div>
        </div>
      </a>
    {/each}
  </div>
</div>