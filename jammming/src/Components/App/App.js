import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    let exists = 0,
        playlist = this.state.playlistTracks;
    playlist.forEach(object => {
      if (track.id === object.id) {
        exists = 1;
        return ;
      }
    });
    if (!exists) {
      playlist.push(track);
      this.setState({playlistTracks: playlist});
    }
  }
  removeTrack(track) {
    let index = 0,
        playlist = this.state.playlistTracks;
    playlist.forEach(object => {
      if (track.id === object.id) {
        playlist.splice(index, 1);
      } else {
        index++;
      }
    });
      this.setState({playlistTracks: playlist});
    }
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }
  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
      playlistName: 'New Playlist',
      searchResults: [],
      playlistTracks: []
    })
  }
  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => this.setState({searchResults: tracks}));
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults} />
            <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
