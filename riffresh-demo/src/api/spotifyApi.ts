const clientId = '8e253a4344c14a55a02b42fe43a3d9ac';
// const redirect_uri = 'http://localhost:3000/';
const redirect_uri = 'http://riffresh.vercel.app/';

let accessToken: string;

const Spotify = {
	getAccessToken() {
		if (accessToken) {
			return accessToken;
		}

		const newAccessToken = window.location.href.match(/access_token=([^&]*)/);
		const newExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
		if (newAccessToken && newExpiresIn) {
			accessToken = newAccessToken[1];
			const expiresIn = Number(newExpiresIn[1]);
			window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&show_dialog=true&redirect_uri=${redirect_uri}`;
			window.location.href = accessUrl;
			// const url = 'https://accounts.spotify.com/api/token';
			// const data = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;
			// const headers = {
			// 	'Content-Type': 'application/x-www-form-urlencoded'
			// };
			// fetch(url, {
			// 	method: 'POST',
			// 	headers: headers,
			// 	body: data
			// })
			// .then(response => response.json())
			// .then(data => {
			// 	accessToken = data.access_token;
			// });
            
		}
	},

	// search(searchTerm) {
	// 	const accessToken = Spotify.getAccessToken();
	// 	const headers = {
	// 		Authorization: `Bearer ${accessToken}`
	// 	};
	// 	return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, { headers: headers })
	// 		.then(
	// 			(response) => {
	// 				if (response.ok) {
	// 					return response.json();
	// 				}
	// 				throw new Error('Request failed!');
	// 			},
	// 			(networkError) => {
	// 				console.log(networkError.message);
	// 			}
	// 		)
	// 		.then((jsonResponse) => {
	// 			if (!jsonResponse.tracks) {
	// 				return [];
	// 			}
	// 			return jsonResponse.tracks.items.map((track) => ({
	// 				id: track.id,
	// 				name: track.name,
	// 				artist: track.artists[0].name,
	// 				album: track.album.name,
	// 				uri: track.uri
	// 			}));
	// 		});
	// },

    // createPlaylist(flavors:[string]) {
    //     const playlistNum = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    //     const playlistName = `Riffresh #${playlistNum}`;
    //     const desc = `A playlist generated by Riffresh for ${flavors.join(', ')}.`;
        

    //     // const accessToken = Spotify.getAccessToken();

    //     const url = 'https://accounts.spotify.com/api/token';
		
			
    // },

	savePlaylist(flavors: Set<any>, trackURIs: string[], setPlaylistURL) {
        const playlistNum = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        const playlistName = `Riffresh #${playlistNum}`;
        
        const desc = `A playlist generated by Riffresh with ${Array.from(flavors).join(', ')}.`;

    

        let playlistURL: string;
		if (playlistName && trackURIs.length) {
			const accessToken = Spotify.getAccessToken();
			const headers = {
				Authorization: `Bearer ${accessToken}`
			};

            const data ={
                "uris": [
                    trackURIs
                ],
                "position": 0
            }

			let userID: string;
			let playlistID;
			return fetch('https://api.spotify.com/v1/me', { headers: headers })
				.then(
					(response) => {
						if (response.ok) {
							return response.json();
						}
						// throw new Error('Request failed! getME');
					},
					(networkError) => {
						console.log(networkError.message);
					}
				)
				.then((jsonResponse) => {
					userID = jsonResponse.id;
                    // console.log(userID);
					return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
						method: 'POST',
						headers: headers,
						body: JSON.stringify({ name: playlistName, description: desc })
					})
						.then(
							(response) => {
								if (response.ok) {
									return response.json();
								}
								// throw new Error('Request failed! 2');
							},
							(networkError) => {
								console.log(networkError.message);
							}
						)
						.then((jsonResponse) => {
							playlistURL = jsonResponse.external_urls.spotify;
                            setPlaylistURL(playlistURL);
                            playlistID = jsonResponse.id;
							return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
								method: 'POST',
								headers: headers,
								body: JSON.stringify({ uris: trackURIs })
							})
								.then(
									(response) => {
										if (response.ok) {
                                            // alert('Playlist was created successfully!')
											return response.json();
										}
										// throw new Error('Request failed! 3');
									},
									(networkError) => {
										console.log(networkError.message);
									}
								)
								.then((jsonResponse) => jsonResponse);
						});
				});
		} else {
			return;
		}
	}
};

export default Spotify;