<script lang="ts">
  let isOpen = $state(false);

    const links = [
        { name: 'About', href: '/about' },
	    { name: 'Sermons', href: '/sermons' },
	        { name: 'Ministries', href: '/ministries' },
		    { name: 'Events', href: '/events' },
		    { name: 'Newsletters', href: '/newsletters'},
		      ];

		        function toggle() {
			    isOpen = !isOpen;
			      }
</script>

<nav class="flex items-center gap-8">
	  <!-- Desktop Links (Hidden on Mobile) -->
	    <div class="hidden md:flex items-center gap-8 font-sans text-sm font-semibold tracking-wide uppercase text-slate-600">
		        {#each links as link}
				      <a href={link.href} class="hover:text-[#D4A373] transition-colors">
					              {link.name}
						            </a>
							        {/each}
								  </div>

								    <!-- Primary CTA (Visible on all) -->
								      <a 
		          href="/visit" 
	        class="hidden md:inline-flex px-6 py-2.5 bg-[#1E293B] text-white text-sm font-bold tracking-wide rounded-sm hover:bg-[#D4A373] transition-colors"
	   >
	       Plan Your Visit
	         </a>

		   <!-- Mobile Hamburger Button -->
		     <button onclick={toggle} class="md:hidden text-2xl text-slate-800 focus:outline-none" aria-label="Toggle Menu">
			         {isOpen ? '✕' : '☰'}
				   </button>

				     <!-- Mobile Drawer -->
				       {#if isOpen}
					           <div class="absolute top-20 left-0 w-full bg-[#FDFCF8] border-b border-stone-200 shadow-xl p-6 flex flex-col gap-6 md:hidden z-40">
							         {#each links as link}
									         <a 
			            href={link.href} 
			            class="text-xl font-serif font-bold text-slate-800"
	                 onclick={() => isOpen = false}
	               >
		                 {link.name}
				         </a>
					       {/each}
					             <a 
			          href="/visit" 
	             class="w-full text-center py-3 bg-[#D4A373] text-white font-bold rounded-sm"
	            >
		            Plan Your Visit
			          </a>
				      </div>
				        {/if}
</nav>
