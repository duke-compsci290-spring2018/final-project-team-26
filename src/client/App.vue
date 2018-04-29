<template>
  <div id="app">
	  <header>
        <nav class="navbar navbar-inverse">
            <div class="container-fluid">
                <div class="navbar-header">
					<button id="favs-button" v-if="permission === 'user' || permission === 'admin'" @click="getUserFavs">My Favorites</button>
                </div>
                <authentication class="nav navbar-nav navbar-right"
                    :getUser="getUser"
                    :setUser="setUser">
                </authentication>
            </div>
        </nav>
    </header>
	  <favorites-view :favsList="myUserFavs" :displayMe="displayUserFavs" :cancel="closeUserFavs"></favorites-view>
	  <h1>Welcome to the YouTube Comment Analyzer</h1>
	  <h2>Created by Ryan Hill for Comp Sci 290: Web Application Design</h2>
    <div id="main">
		<searcher :search="search" :undo="undoSearch" :videoIsNotActive="activeVideo"></searcher>
		<div v-if="activeVideo === null">
			<result-entry v-for="vid in videos"
					  :video="vid" :thumbnail="vid.snippet.thumbnails.default"
					  :key="vid.id.videoId" :activate="setActiveVideo"></result-entry>
		</div>
		<analyzer v-if="activeVideo !== null" :video="activeVideo" :returnFunc="unSetActiveVideo" :analysisRecord="sendAnalysisToDB" :isUser="permission === 'user' || permission === 'admin'" :addFav="addNewUserFav"></analyzer>
	</div>
	  <p id="explanation">To begin, type the video you're looking for into the search bar above, just as you would for a normal search on YouTube. From there, you can click on a video to pick it, and then order an analysis from the menu that opens.</p>
<!--	  <button @click="checkPermission"></button>-->
	  <div id="admin-section" v-if="permission === 'admin'">
		  <h3>Welcome, Site Administrator</h3>
		  <div id="search-records">
		  	<button @click="getSearchRecord">Show Me Search Records</button>
		  	<ul>
				<li v-for="search in mySearchRecords">{{search.text}} - searched {{search.count}} times</li>
			</ul>
		  	<button v-if="mySearchRecords.length > 0" @click="mySearchRecords = []">Close Search Records</button>
		</div>
		<div id="analysis-records">
			<button @click="getAnalysisRecord">Show Me Analysis Records</button>
			<ul>
				<li v-for="anlys in myAnalysisRecords">{{anlys.timestamp}} -- {{anlys.title}}, {{anlys.analysisType}} -- user: {{anlys.myUser.name}}, {{anlys.myUser.email}}, {{anlys.myUser.uid}} -- VideoID:{{anlys.id}}</li>
			</ul>
			<button v-if="myAnalysisRecords.length > 0" @click="myAnalysisRecords = []">Close Analysis Records</button>
		</div>
		<div id="user-records">
		  	<button @click="getUserRecord">Show Me User Records</button>
		  	<ul>
				<li v-for="usr in myUserRecords">
					<span>{{usr.uid}}>{{usr.uid}} - rank: {{usr.rank}}</span>
					<button v-if="usr.rank !== 'admin'" class="admin-promote" @click="setUserCreds(usr, 'admin')">Promote To Administrator</button>
					<button v-if="usr.rank === 'admin'" class="admin-demote" @click="setUserCreds(usr, 'user')">Demote</button>
				</li>
			</ul>
		  	<button v-if="myUserRecords.length > 0" @click="myUserRecords = []">Close Search Records</button>
		</div>
	</div>
  </div>
</template>

<script>
import { analysisRef, searchesRef, usersRef } from './database';
import ResultEntry from "./components/ResultEntry.vue";
import Searcher from "./components/Searcher.vue";
import Analyzer from "./components/Analyzer.vue";
import Authentication from "./components/Authentication.vue";
import FavoritesView from "./components/FavoritesView.vue"
import {YOUTUBE_KEY, CLIENT_ID} from "./keys.js";
export default {
  name: 'app',
	data () {
		return {
			videos: [],
			activeVideo: null,
			//some placeholder values for testing
			testtitle: "Test Title",
			testchannel: "Test Channel",
			testlength: "3:50",
			testthumbnail: "",
			user: null,
			permission: "guest",
			mySearchRecords: [],
			myAnalysisRecords: [],
			myUserRecords: [],
			myUserFavs: [],
			displayUserFavs: false
		}
	},
	firebase: {
        // local representations of firebase data, but separate from vue-images component data
		analysislist: analysisRef,
		searchlist: searchesRef,
		userlist: usersRef
    },
	components: {
		ResultEntry,
		Searcher,
		Analyzer,
		Authentication,
		FavoritesView
	},
	
//	created: function () {
//		analysisRef.set({
//			init: {
//				title: "Test",
//				id: "id",
//				analysis: "test",
//				timestamp: "N/A"
//			}
//		})
//	},
	
	methods: {
		//sends the user's search to the YouTube API and puts the result in the videos list
		search () {
			console.log("entered search");
			var mySearch = $("#searcher input").val();
			this.activeVideo = null;
			console.log(mySearch);
			var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&key="+ YOUTUBE_KEY + "&q=";//first part of url to request to (need to format search before putting it in as value for q)
			url += this.formatSearch(mySearch);//complete the url to send the GET request to
			console.log(url);
			//sends GET request to the url and puts the JSON sent back in the videos list
			$.get(url, (ret) => {
				this.videos = ret.items;
				console.log(this.videos);
			});
			
			if(this.permission === "user" || this.permission === "admin") {
				this.sendSearchToDB(mySearch);
			}
		},
		
		sendSearchToDB (search) {
			searchesRef.once('value', snapshot => {
				var currentRecord = snapshot.val();
				var match = this.findSearchKey(currentRecord, search);
				if(match === false) {
					var newSearchRef = searchesRef.push();
					newSearchRef.set({
						text: search,
						count: 1
					});
				}
				else {
					var newCount = currentRecord[match].count + 1;
					searchesRef.update({
						[match]: {
							text: search,
							count: newCount
						}
					});
				}
			});
		},
		sendAnalysisToDB (video, analysisType) {
			var d = new Date();
			var timestamp = "";
			timestamp = timestamp + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ", " + d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
			var newAnalysisRef = analysisRef.push();
			newAnalysisRef.set({
				title: video.snippet.title,
				id: video.id.videoId,
				analysis: analysisType,
				timestamp: timestamp,
				myUser: this.user
			});
		},
		//used so that I can check the contents of the videos list
		videosCheck () {
			console.log(this.videos);
			console.log(this.activeVideo);
			console.log(typeof(this.activeVideo));
		},
		checkPermission () {
			console.log("checking user and permission:");
			console.log(this.user);
			console.log(this.permission);
			console.log(this.videos);
			console.log(this.activeVideo);
		},
		getSearchRecord () {
			this.mySearchRecords = [];
			searchesRef.once('value', snapshot => {
				var searches = snapshot.val();
				Object.keys(searches).forEach(key => {
					var curr = searches[key];
					this.mySearchRecords.push(curr);
				});
			});
		},
		getAnalysisRecord () {
			this.myAnalysisRecords = [];
			analysisRef.once('value', snapshot => {
				var analyses = snapshot.val();
				Object.keys(analyses).forEach(key => {
					var curr = analyses[key];
					this.myAnalysisRecords.push(curr);
				});
			});
		},
		getUserRecord () {
			this.myUserRecords = [];
			usersRef.once('value', snapshot => {
				var usersRec = snapshot.val();
				Object.keys(usersRec).forEach(key => {//want admins first in record
					var curr = usersRec[key];
					if(curr.rank === "admin") {
						this.myUserRecords.push(curr);
					}
				});
				Object.keys(usersRec).forEach(key => {//non-admins after admins
					var curr = usersRec[key];
					if(curr.rank !== "admin") {
						this.myUserRecords.push(curr);
					}
				});
			});
		},
		getUserFavs() {
			this.myUserFavs = [];
			usersRef.child(this.user.key + '/favorites').once('value', snapshot => {
				var snap = snapshot.val();
				if(snap !== null) {
					console.log(snapshot.val());
					Object.keys(snap).forEach(key => {
					console.log(snap[key]);
					this.myUserFavs.push(snap[key]);
					});
					console.log(this.myUserFavs);
				}
				this.displayUserFavs = true;
			});
		},
		addNewUserFav (video) {
			console.log("adding new favorite:");
			console.log(video);
			console.log(this.user);
			usersRef.child(this.user.key).once('value', snapshot => {
				var userData = snapshot.val();
				var hasFavs = false;
				Object.keys(userData).forEach(key =>{//check whether favorites exists in the record or not
					if(key === 'favorites') {
						hasFavs = true;
					}
				});
				
				if(hasFavs) {
					var newFavRef = usersRef.child(this.user.key + '/favorites').push();
					newFavRef.set({
						video: video
					});
				}
				else {
					usersRef.child(this.user.key + '/favorites').set({//initializing with a dummy key I made up (will be used once for each user, but should be fine because the data is split and there will be no conflicts)
						"77xfre4342de0x": {
							video: video
						}
					});
				}
			});
		},
		//takes in a string and formats it to be given in a search request to YouTube in the following form:
		//if it is a single word, do not change it; if there are multiple words, replace the spaces between them with pluses
		formatSearch(str) {
			console.log(str);
			var words = str.split(" ");
			console.log(words);
			var formattedSearch = "";
			if(words.length > 1) {
				words.forEach((word) => {
					formattedSearch = formattedSearch + word + "+"
				});
				console.log(formattedSearch);
				formattedSearch = formattedSearch.substring(0, formattedSearch.length-1);//cut off last '+'
			}
			else {
				formattedSearch = str;//just use str if only one word or less
			}
			console.log(formattedSearch);
			return formattedSearch;
		},
		
		undoSearch() {
			this.videos = [];
			$("#searcher input").val("");
		},
		
		setActiveVideo(vid) {
			console.log("Setting active:");
			console.log(vid);
			this.activeVideo = vid;
		},
		
		unSetActiveVideo() {
			this.activeVideo = null;
		},
		setUserCreds (user, newRank) {
			usersRef.once('value', snapshot => {
				var uList = snapshot.val();
				var keyMatch = this.findUserKey(uList, user);
				usersRef.update({
					[keyMatch]: {
						uid: user.uid,
						rank: newRank
					}
				});
			});
		},
		
		getUserCreds () {
			usersRef.once('value', (snapshot) => {
				console.log("getting user credentials");
				var users = snapshot.val();
				console.log(users);
				var search = this.findUserKey(users, this.user);
				this.user['key'] = search;
				console.log(search);
				if(search===false) { //user not in database authorization record
					console.log("adding user to authorization record");
					var newUserRef = usersRef.push();
					newUserRef.set({
						uid: this.user.uid,
						rank: "user"
					});
					this.permission = "user";
				}
				else {
					console.log(users[search].rank);
					this.permission = users[search].rank;
				}
			});
		},
		// allow child component to change user value
        getUser () {
            return this.user
        },
        setUser (user) {
			console.log("setting user");
            this.user = user;
			if(user) {//prevents error from trying to make null access
				console.log("before entering getUserCreds");
				this.getUserCreds();
			}
			else {
				this.permission = null;
			}
			console.log(this.user);
			console.log(this.permission);
        },
		//obtains the key matching a given user's uid in the authorization record, returns false if the uid is not found
		findUserKey(uList,user) {
			console.log(user.uid);
			var foundIt = false;
			var matchKey = "";
			Object.keys(uList).forEach(key => {
				console.log(key);
				console.log(uList[key]);
				console.log(user.uid);
				if(uList[key].uid === user.uid) {
					console.log("returning key");
					foundIt = true;
					matchKey = key;
				}
			});
			if(foundIt) {
				return matchKey;
			}
			else {
				return false;
			}
		},
		
		//looks for key corresponding to a search in the database record - returns key if found, false if not
		findSearchKey (sList, search) {
			var foundIt = false;
			var matchKey = "";
			Object.keys(sList).forEach(key => {
				console.log(key);
				console.log(sList[key]);
				if(sList[key].text === search) {
					console.log("returning key");
					foundIt = true;
					matchKey = key;
				}
			});
			if(foundIt) {
				return matchKey;
			}
			else {
				return false;
			}
		},
		
		closeUserFavs () {
			this.displayUserFavs = false;
		}
	}
}
</script>

<style lang="scss" scoped>
	#main {
		background-color: #ff0023;
		border-radius: 10px;
		padding-left: 5px;
		padding-bottom: 5px;
	}
	h1, h2 {
		text-align: center;
	}
	#explanation {
		font-size: 14pt;
		margin: 2%;
	}
	.navbar {
		background-color: #7c0000;
		color: white;
		margin-bottom: 3%;
	}
	#admin-section {
		background-color: #fefafe;
		border: 10px solid red;
		border-radius: 10px;
	}
	li span {
		width: 80%
	}
	.admin-promote, .admin-demote {
		margin-left: 5%;
	}
	#favs-button {
		background-color: #7c0000;
		border:none;
		color: white;
		padding: 10px;
	}
	#favs-button:hover {
		background-color: #bc0000;
	}
</style>