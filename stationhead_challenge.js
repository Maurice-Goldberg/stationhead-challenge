const tracksInCommon = (spotifyPlaylistId, applePlaylistId) => {
    let numTracksInCommon = 0;

    //Call to Apple API with a placeholder variable for the Apple developer token
    $.ajax({
        method: 'GET',
        headers: {  'Authorization': 'Bearer ' + APPLE_DEVELOPER_TOKEN},
        url: `https://api.music.apple.com/v1/catalog/us/playlists/${applePlaylistId}`
    }).then((appleResponse) => {
        //Call to Spotify API with a placeholder variable for the Spotify access token
        $.ajax({
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + SPOTIFY_ACCESS_TOKEN },
            url: `https://api.spotify.com/v1/playlists/${spotifyPlaylistId}`
        }).then((spotifyResponse) => {
            let isrcsInCommon = [];
            appleResponse["data"][0]["relationships"]["tracks"]["data"].forEach((appleTrackObj) => {
                let appleTrackISRC = appleTrackObj["attributes"]["isrc"];
                spotifyResponse["tracks"]["items"].forEach((spotifyTrackObj) => {
                    let spotifyTrackISRC = spotifyTrackObj["track"]["external_ids"]["isrc"];
                    if(appleTrackISRC === spotifyTrackISRC && !isrcsInCommon.includes(appleTrackISRC)) {
                        numTracksInCommon++;

                        //to prevent duplicate tracks in a single playlist from skewing the result:
                        isrcsInCommon.push(appleTrackISRC);
                    } 
                });
            });
            console.log(numTracksInCommon);
        });
    });
    return numTracksInCommon;
}