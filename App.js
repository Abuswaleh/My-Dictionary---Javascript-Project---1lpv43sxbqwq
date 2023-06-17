// create, remove word card of page. also manage localstorage.
class ManageCard{
    static wordcard_container = document.querySelector(".wordcard_container");

    static getCards(){
        let cards;
        if(localStorage.getItem("searches")){
            cards = JSON.parse(localStorage.getItem("searches"));
        } else {
            cards = [];
        }
        return cards;
    }
    static addCard(e){
        let cards = ManageCard.getCards();
        cards.push(e);
        localStorage.setItem("searches",JSON.stringify(cards));
    }
    static removeCard(wordToDelete){
        let cards = ManageCard.getCards();
        cards.forEach((obj,index) => {
            if(obj.word == wordToDelete){
                cards.splice(index,1);
            }
        });
        localStorage.setItem("searches", JSON.stringify(cards));
    }
    static createCardEl(nameEl, parentEl, classEl=false, textEl=false, imgEl=false){
        const elem = document.createElement(nameEl);
        if(classEl){
            elem.classList.add(classEl);
        }
        if(textEl){
            elem.textContent = textEl;
        }
        if(imgEl){
            elem.src = "/resource/delete.png";
        }
        parentEl.appendChild(elem);
        return elem;
    }
    static createCard(data ,deleteable=true){
        const wordcard = ManageCard.createCardEl("div", ManageCard.wordcard_container, "wordcard");
        const div = ManageCard.createCardEl("div", wordcard);
        const card_head = ManageCard.createCardEl("p", div, "card_head", "word : ");
        const card_word = ManageCard.createCardEl("span", card_head, false, data.word);
        const card_body = ManageCard.createCardEl("p", div, "card_body", data.meaning);

        let cards = ManageCard.getCards();
        let words = Object.values(cards).map((obj) => obj.word);
        if(words.includes(data.word)){
            // return;
        }else{
            ManageCard.addCard(data);
        }
        if(deleteable){
            const deleteBtn = ManageCard.createCardEl("img",wordcard, "delete_btn", false, true );
            
            deleteBtn.addEventListener("click", (e)=>{
                const wordcard = e.target.parentElement;
                ManageCard.removeCard(wordcard.querySelector("span").textContent);
                wordcard.remove();
            });
            
        }
    }
    static displayAllCards(){
        const cards = this.getCards();
        cards.forEach((card)=>{
            this.createCard(card);
        })
    }
}

const search_input = document.getElementById("search_input");
const error_msg = document.querySelector(".error_msg");
const search_container = document.querySelector(".search_container");

// click event for search word from api.
document.getElementById("search_btn").onclick = (e)=>{
    const wordToSearch = search_input.value;
    document.querySelector(".wordcard_container").innerHTML = "";
    
    if(wordToSearch !== ""){
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToSearch}`)
        .then((res)=>{
            return res.json();
        })
        .then((data)=>{
            error_msg.classList.add("disabled");

            const meaning = data[0].meanings[0].definitions[0].definition;
            ManageCard.createCard({word:wordToSearch ,meaning:meaning},false);
        })
        .catch((err)=>{
            error_msg.querySelector("span").textContent = wordToSearch;
            error_msg.classList.remove("disabled");
        })
        .finally(()=>{
            search_input.value = "";
        })
    }
    
}

// click event for switch between search and history panel;
document.getElementById("switch_btn").onclick = (e)=>{
    document.querySelector(".wordcard_container").innerHTML = "";

    if(e.target.textContent == "HISTORY"){
        e.target.textContent = "SEARCH";
        search_container.classList.add("disabled");

        ManageCard.displayAllCards();
    }else{
        e.target.textContent = "HISTORY";
        search_container.classList.remove("disabled");
    }
}