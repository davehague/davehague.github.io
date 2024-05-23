class PromptDB {
    constructor() {
        this.db = null;
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("PromptDB", 1); 

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                this.db.createObjectStore("prompts", { keyPath: "id", autoIncrement: true });
                this.db.createObjectStore("tags", { keyPath: "id", autoIncrement: true }); 
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                reject(new Error("Error opening IndexedDB"));
            };
        });
    }

    async addPrompt(promptData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["prompts"], "readwrite");
            const store = transaction.objectStore("prompts");
            const request = store.add(promptData);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(new Error("Error adding prompt"));
            };
        });
    }

    async getPrompt(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["prompts"], "readonly");
            const store = transaction.objectStore("prompts");
            const request = store.get(id);
    
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
    
            request.onerror = (event) => {
                reject(new Error("Error getting the prompt"));
            };
        });
    }
   

    async getAllPrompts() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["prompts"], "readonly");
            const store = transaction.objectStore("prompts");
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(new Error("Error getting all prompts"));
            };
        });
    }

    async updatePrompt(id, updatedData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["prompts"], "readwrite");
            const store = transaction.objectStore("prompts");
            const request = store.put({ ...updatedData, id: id });
    
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
    
            request.onerror = (event) => {
                reject(new Error("Error updating the prompt"));
            };
        });
    }
    

    async deletePrompt(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("prompts", "readwrite");
            const store = tx.objectStore("prompts");
            const request = store.delete(id);

            request.onsuccess = (event) => {
                resolve(id);
            };

            request.onerror = (event) => {
                reject(new Error("Could not delete the prompt"));
            };
        });
    }

    async addTag(tag) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["tags"], "readwrite");
            const store = transaction.objectStore("tags");
            const request = store.add({ name: tag });

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(new Error("Error adding tag"));
            };
        });
    }

    async getAllTags() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["tags"], "readonly");
            const store = transaction.objectStore("tags");
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(new Error("Error getting all tags"));
            };
        });
    }
}

export default new PromptDB();
