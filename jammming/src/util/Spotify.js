let accessToken;
const clientID = '12cc1769fc5c4833bc3b1face76fa624';
const redirectURI = "http://localhost:3000/";

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else {
      const newToken = window.location.href.match(/access_token=([^&]*)/),
            expiresIn = window.location.href.match(/expires_in=([^&]*)/);

      if (newToken && expiresIn) {
        accessToken = newToken[1];
        let expireTime = Number(expiresIn[1]);
        window.setTimeout(() => accessToken = '', expireTime * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
      }
    }
  },
  search(searchTerm) {
    this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}&limit=50`, {
          headers: {Authorization: `Bearer ${accessToken}`}
      }).then(response => {
          return response.json();
      }).then(jsonResponse => {
          if (jsonResponse.tracks) {
              return jsonResponse.tracks.items.map(track => ({
                      id: track.id,
                      name: track.name,
                      artist: track.artists[0].name,
                      album: track.album.name,
                      uri: track.uri
                  }
              ));
          } else {
            return [];
          }
        });
  },
  savePlaylist(playlistName, trackURIs) {
      if (!(playlistName && trackURIs)) {
          return;
      }

      const headers = {'Authorization': 'Bearer ' + accessToken};
      let userId;
      fetch('https://api.spotify.com/v1/me', {headers: headers})
          .then(response => {
              return response.json();
          }).then(jsonResponse => {
          if (!jsonResponse.id) {
              return;
          }

          userId = jsonResponse.id;
          fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify({name: playlistName})
          }).then(response => {
              return response.json();
          }).then(jsonResponse => {
              if (!jsonResponse.id) {
                  return;
              }

              let playlistID = jsonResponse.id;

              fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
                  method: 'POST',
                  headers: headers,
                  body: JSON.stringify({uris: trackURIs})
              })
          })

      })
  }
};

export default Spotify;
