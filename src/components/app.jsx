import { LaunchList } from "./launchList";
import { Map } from "./map";
import { useEffect, useState } from "react";
import { SpaceX } from "../api/spacex";

function App() {

    const [launches, setLaunches] = useState([]);
    const [launchpads, setLaunchpads] = useState([]);
    const [activePad, setActivePad] = useState(null);
    useEffect(() => {
        const spacex = new SpaceX();
        Promise.all([spacex.launches(), spacex.launchpads()]).then(([launches, launchpads]) => {
            setLaunches(launches);
            setLaunchpads(launchpads);
        })
    }, [])

    return (
        <main className='main'>
            <LaunchList launches={launches} onHover={setActivePad} />
            <Map launchpads={launchpads} activePad={activePad} />
        </main>
    )
}

export { App };
