import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
    const sidebarCollapsed = ref(false)
    const pageTitle = ref('Dashboard')
    const globalLoading = ref(false)

    function toggleSidebar() {
        sidebarCollapsed.value = !sidebarCollapsed.value
    }

    function setPageTitle(title: string) {
        pageTitle.value = title
        document.title = `${title} | Full Stack Template`
    }

    function setGlobalLoading(val: boolean) {
        globalLoading.value = val
    }

    return {
        sidebarCollapsed, pageTitle, globalLoading,
        toggleSidebar, setPageTitle, setGlobalLoading,
    }
})
