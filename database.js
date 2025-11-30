/* public/database.js */
const API_URL = "http://localhost:3000/api";
const USER_KEY = 'uefa_user_id';
const PREDICTIONS_KEY = 'uefa_predictions';

const DB = {
    user: null,
    squad: [],
    players: [],
    predictions: {},

    async init() {
        // Load local predictions (Client-side feature)
        const storedPreds = localStorage.getItem(PREDICTIONS_KEY);
        if(storedPreds) this.predictions = JSON.parse(storedPreds);

        // Check Authentication
        const storedId = localStorage.getItem(USER_KEY);
        
        // Redirect to login if not authenticated and trying to access main pages
        if(!storedId && !window.location.href.includes('login') && !window.location.href.includes('signup')) {
            window.location.href = 'login.html';
            return;
        }

        // Load Data if logged in
        if(storedId) {
            await this.loadUserData(storedId);
        }
        await this.loadAllPlayers();
    },

    async loadUserData(id) {
        try {
            const res = await fetch(`${API_URL}/user/${id}`);
            if(!res.ok) throw new Error("User fetch failed");
            
            const data = await res.json();
            this.user = data.user;
            this.squad = data.squad;
        } catch(e) { 
            console.error("Error loading user:", e);
            // If the user ID in local storage doesn't exist in the new DB, logout
            this.logout();
        }
    },

    async loadAllPlayers() {
        try {
            const res = await fetch(`${API_URL}/players`);
            this.players = await res.json();
        } catch(e) {
            console.error("Error loading players:", e);
        }
    },

    async login(email, password) {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });
        const data = await res.json();
        if(data.success) {
            localStorage.setItem(USER_KEY, data.user.id);
            return true;
        }
        return false;
    },

    async signup(payload) {
        const res = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        return await res.json();
    },

    async buyPlayer(playerId) {
        const res = await fetch(`${API_URL}/buy`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: this.user.id, playerId })
        });
        const data = await res.json();
        
        // If successful, reload data to update UI (Budget, Squad list)
        if(data.success) await this.init(); 
        return data;
    },

    async sellPlayer(playerId) {
        const res = await fetch(`${API_URL}/sell`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: this.user.id, playerId })
        });
        const data = await res.json();
        if(data.success) await this.init();
        return data;
    },

    // CAPTAINCY FEATURE
    async setCaptain(playerId) {
        const res = await fetch(`${API_URL}/captain`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: this.user.id, playerId })
        });
        const data = await res.json();
        if(data.success) await this.init(); // Reload to show badge
        return data;
    },

    // PREDICTIONS FEATURE (Saved locally)
    savePrediction(matchId, pick) {
        this.predictions[matchId] = pick;
        localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(this.predictions));
    },
    
    logout() {
        localStorage.removeItem(USER_KEY);
        window.location.href = 'login.html';
    }
};

// Auto-initialize when page loads
if(!window.location.href.includes('login') && !window.location.href.includes('signup')) {
    DB.init().then(() => {
        // Trigger the page's render function once data is ready
        if(window.onDBReady) window.onDBReady(); 
    });
}