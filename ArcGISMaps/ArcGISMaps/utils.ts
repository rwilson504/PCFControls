export type Resource = { type: "script" | "style" | "module"; src: string };

export async function loadResources(resources: Resource[]): Promise<void> {
    const loadPromises = resources.map(resource => {
        return new Promise<void>((resolve, reject) => {
            let element: HTMLScriptElement | HTMLLinkElement | null = null;

            if (resource.type === 'script' || resource.type === 'module') {
                element = document.createElement('script');
                element.type = resource.type === 'module' ? 'module' : 'text/javascript';
                element.src = resource.src;
                element.async = false;  // Optional: makes the script load asynchronously                
            } else if (resource.type === 'style') {
                element = document.createElement('link');
                element.rel = 'stylesheet';
                element.href = resource.src;
            }

            if (element) {
                element.onload = () => resolve();  // Resolve the promise when the resource is loaded
                element.onerror = () => reject(new Error(`Failed to load ${resource.src}`));  // Reject the promise if there's an error
                document.head.appendChild(element);
            } else {
                reject(new Error(`Invalid resource type: ${resource.type}`));
            }
        });
    });

    await Promise.all(loadPromises);  // Wait for all resources to be loaded
}
