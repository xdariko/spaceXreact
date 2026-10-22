const CACHE_TTL = 24 * 60 * 60 * 1000;

class SpaceX{
    constructor(baseUrl = "https://ll.thespacedevs.com/2.2.0/") {
        this.baseUrl = baseUrl;
    }
    launches(){
        return cachedFetch(`${this.baseUrl}launch/previous/?lsp__name=SpaceX&limit=100`)
            .then(data=>data.results.map(launch=>({
                id: launch.id,
                name: launch.name,
                date: launch.net,
                pad: toLaunchpad(launch.pad)
            })))
    }
    launchpads(){
        return this.launches()
            .then(launches=>{
                const pads = new Map();
                launches.forEach(launch=>pads.set(launch.pad.id, launch.pad));
                return [...pads.values()];
            })
    }
    launchpad(id){
        return cachedFetch(`${this.baseUrl}pad/${id}/`)
            .then(toLaunchpad)
    }

}

function toLaunchpad(pad){
    return {
        id: pad.id,
        name: pad.name,
        location: pad.location.name,
        latitude: Number(pad.latitude),
        longitude: Number(pad.longitude)
    };
}

function cachedFetch(url){
    const cached = JSON.parse(localStorage.getItem(url));
    if (cached && Date.now() - cached.time < CACHE_TTL) {
        return Promise.resolve(cached.data);
    }
    return fetch(url)
        .then(response=>{
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data=>{
            localStorage.setItem(url, JSON.stringify({time: Date.now(), data}));
            return data;
        })
}

export {SpaceX}
