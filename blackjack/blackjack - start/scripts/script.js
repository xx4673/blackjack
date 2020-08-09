// 程式碼寫在這裡!

let yourDeck = [] ;
let dealerDeck = [] ;
let yourPoint = 0 ;
let dealerPoint = 0;
// 設定真假值
let inGame = false ;
// 論輸贏
let winner = 0; 

$(document).ready(function(){
    initCard();
    initButtons();
});    

function newGame(){
    // 初始化    
    resetGame();
    deck = shuffle(buildDeck());
    yourDeck.push(deal()) ;
    dealerDeck.push(deal()) ;
    yourDeck.push(deal()) ;

    dontCheckWinnerAtFirst() ;
    // 開始遊戲
    inGame = true ;
    renderGameTable();
  
}
function dontCheckWinnerAtFirst(){
    if(dealerPoint>yourPoint){
        $('.zone').removeClass('win');
    }
    $('.A').removeClass('tie');
}
function deal(){
    return deck.shift();
}

function initButtons(){
    $('#action-new-game').click(evt=>{newGame()});

    // 按hit,使其有再發一張牌的功能
    $('#action-hit').click(evt=>{
        evt.preventDefault();
        yourDeck.push(deal());
        renderGameTable();
    });

    $('#action-stand').click(evt=>{
        evt.preventDefault();
        dealerDeck.push(deal());
        // renderGameTable();因為dealerRound裡有寫了
        dealerRound();

    });
}

function initCard(){
    $('.card div').html('☆');
}

function buildDeck(){
    let deck = [] ;

    for (let suit=1 ; suit <= 4 ; suit ++){
    for (let number=1 ; number<=13; number++){
        let c = new Card(suit,number);
        deck.push(c);
     }
    }
    return deck;
}

// 洗牌
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

function renderGameTable(){
    // 牌
    yourDeck.forEach((card, i)=>{
        let theCard = $(`#yourCard${i+1}`) ;
        theCard.html(card.cardNumber()) ;
        theCard.prev().html(card.cardSuit());
    });

    dealerDeck.forEach((card, i)=>{
        let theCard = $(`#dealerCard${i+1}`) ;
        theCard.html(card.cardNumber()) ;
        theCard.prev().html(card.cardSuit());
    });

    // 算點數&顯示點數
    yourPoint = calcPoint(yourDeck) ;
    dealerPoint = calcPoint(dealerDeck);

     // 玩家or莊家點數>21點 即遊戲結束
     if(yourPoint>=21 || dealerPoint>=21){
        inGame = false;
     }
    
    checkWinner();
    showWinStamp();

    $('.your-cards h1').html(`你(${yourPoint}點)`);
    $('.dealer-cards h1').html(`莊家(${dealerPoint}點)`);

    // 按鈕(使按鈕在遊戲中亮起or終止)
    // if(inGame){
    //     $('#action-hit').attr('disabled', false);
    //     $('#action-stand').attr('disabled', false);
    // }else{
    //     $('#action-hit').attr('disabled', true);
    //     $('#action-stand').attr('disabled', true);
    // }

    // short-Form
    $('#action-hit').attr('disabled',!inGame);
    $('#action-stand').attr('disabled',!inGame);
    
}

function checkWinner(){
      //  論輸贏
      switch(true){
       
        // 玩家點數=21
        case yourPoint == 21 :
            winner = 1 ;
            break ;
        
        // 玩家爆點
        case yourPoint > 21 :
            winner = 2;
            break ;
        // 莊家爆點
        case dealerPoint > 21 :
            winner = 1 ;
            break ;
        // 平手
        case dealerPoint == yourPoint :
            winner = 3;
            break;
         // 莊家點數>玩家
         case dealerPoint > yourPoint :
            winner = 2;
            break ;
        // case      :
        //     winner = 1 ;
        //     break ;
        //其他
        default :
           winner = 0 ;
           break ;
    }
}

function showWinStamp(){
    switch(winner){
        case 1: //玩家贏
           $('.your-cards').addClass('win');
           break;

        case 2: //莊家贏
           $('.dealer-cards').addClass('win');
           break;

        case 3: //平手
          $('.game-table').addClass('tie');
          break;
        default:
            break;


    }
 }

function calcPoint(deck){
    let point = 0 ;
    deck.forEach(card=>{
        point+=card.cardPoint();
    });

    // 當點數>21時 A為1點
    if( point > 21 ){
        deck.forEach(card=>{
            if(card.cardNumber()==='A'){
                point-=10;
            }
        })
    }
    return point;

}

// 使牌組歸零 重新洗牌
function resetGame(){
    deck = [];
    yourDeck = [];
    dealerDeck = [];
    yourPoint = 0;
    dealerPoint = 0;
    initCard();
    winner = 0 ;
    $('.zone').removeClass('win');
    $('.A').removeClass('tie');
}

// 莊家行動
// 1.發牌
// 2.若莊家點數>玩家點數,則莊家贏
// 3.若莊家點數<玩家點數,則繼續發牌
// 4.若爆點,則玩家贏

function dealerRound(){
    while(true){
        dealerPoint = calcPoint(dealerDeck);
        if(dealerPoint<yourPoint){
            dealerDeck.push(deal());
        }else{
            break;
        }
    }
    inGame = false;
    renderGameTable();
}

class Card {
    constructor(suit ,number){
        this.suit = suit ;
        this.number = number ;
    }

cardNumber(){
    switch(this.number){
        case 1:
            return 'A' ;
        case 11:
            return 'J' ;
        case 12:
            return 'Q' ;
        case 13:
            return 'K' ;
        default:
            return this.number;
    }
}

// 點數
    cardPoint(){
        switch(this.number){
            case 1:
                return 11 ;
            // case 11:
            // case 12:
            // case 13:
            //     return 10;
            default :
                return 1 ;//this.number ;
        }
    }

// 花色    
    cardSuit(){
        switch(this.suit){
            case 1:
                return '♠' ;
            case 2:
                return '♥' ;
            case 3:
                return '♣' ;
            case 4:
                return '♦' ;
        }
    }
}