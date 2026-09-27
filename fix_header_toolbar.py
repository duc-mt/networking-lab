import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

old_header = r"""  <header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-50 dark:bg-slate-900/50 backdrop-blur sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <a href="../../index.html" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors text-sm font-medium">
          <i class="fa-solid fa-arrow-left mr-2"></i>Portfolio
        </a>
        <div class="h-6 w-px bg-slate-700"></div>
        <h1 class="text-xl font-bold text-slate-900 dark:text-white leading-tight">
          EVPN-VXLAN over MPLS Transit
        </h1>
      </div>
      <div class="flex items-center gap-4">
        <button id="btn-theme" onclick="toggleTheme()" class="w-9 h-9 rounded-full flex items-center justify-center text-amber-500 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all-fast" title="Toggle Theme">
          <i id="theme-icon" class="fas fa-sun"></i>
        </button>
      </div>
    </div>
  </header>"""

new_header = """  <header class="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 md:gap-4 overflow-hidden">
              <a href="../../index.html" class="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all-fast shrink-0" title="Về trang chủ Portfolio">
                  <i class="fas fa-home text-sm"></i>
              </a>
              <div class="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden md:block shrink-0"></div>
              <div class="flex flex-col min-w-0">
                  <a href="../../index.html" class="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-amber-500 uppercase tracking-wider mb-0.5 truncate transition-colors flex items-center gap-1">
                      <i class="fas fa-arrow-left text-[10px]"></i> Portfolio
                  </a>
                  <h1 class="text-xl font-bold text-slate-900 dark:text-white leading-tight truncate">EVPN-VXLAN over MPLS Transit</h1>
              </div>
          </div>
          <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full border border-slate-200 dark:border-slate-700">
              <button onclick="location.reload()" class="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-red-500 hover:shadow transition-all-fast" title="Reset Lab"><i class="fas fa-undo"></i></button>
              <div class="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
              <button onclick="toggleTheme()" class="w-9 h-9 rounded-full flex items-center justify-center text-amber-500 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow transition-all-fast" title="Toggle Theme"><i id="theme-icon" class="fas fa-sun"></i></button>
          </div>
      </div>
  </header>"""

content = content.replace(old_header, new_header)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
