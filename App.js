// create, remove word card from page. also manage localstorage.
class ManageCard{
    static getCards(){
        let cards;
        if(localStorage.getItem("searches")){
            cards = JSON.parse(ManageCard.getItem("searches"));
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
        const wordcard = ManageCard.createCardEl("div", wordcard_container, "wordcard");
        const div = ManageCard.createCardEl("div", wordcard);
        const card_head = ManageCard.createCardEl("p", div, "card_head", `word : ${data[word]}`);
        const card_body = ManageCard.createCardEl("p", div, "card_body", data[meaning]);

        let cards = ManageCard.getCards();
        let words = Object.values(cards).map((obj) => obj.word);
        if(words.includes(data.word)){
            return;
        }else{
            ManageCard.addCard(data);
        }

