// Função start do game
function start(){

    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    //! Principais variáveis do jogo
    var pontos=0;
    var salvos=0;
    var perdidos=0;
    var jogo = {};
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    var podeAtirar = true;
    var fimdejogo = false
    var energiaAtual=3;

    //? Configurando e reconhecendo se o usuário apertou alguma tecla 
    var TECLA = {
        W: 87, // Movimentação para cima
        S: 83, // Movimentação para baixo
        L: 76 // Disparo do míssil 
    }

    jogo.pressionou = [];

    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");

    //Música em loop
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

    // Verifica se o usuário pressionou alguma tecla
    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });
    
    //! Movimentação da imagem de fundo do jogo e movimentação do jogador
    // Game Loop()

    //? Função Loop do jogo
    jogo.timer = setInterval(loop,30);

    function loop(){
        movefundo(); 
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();

    } // Fim da função Loop()

     //? Movimentação da imagem de fundo
    function movefundo(){
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda-1);
    } //Fim da função movefundo()

     //? Movimentação do jogador
    function movejogador (){
        if(jogo.pressionou[TECLA.W]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo-10);

                //? If para que o jogador não saia para fora da tela no topo
                if(topo<=9){
                    $("#jogador").css("top",topo+10)
                }
        }
        

        if(jogo.pressionou[TECLA.S]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo+10);

            //? If para criar um posição limite do jogador para baixo 
            if(topo>=440){
                $("#jogador").css("top",topo-10)
            }
        }

        if(jogo.pressionou[TECLA.L]){

            // Chama a função disparo()
            disparo();            
        }
    } // Fim da função movejogador()

    //! Movimentação do Inimigo1
    function moveinimigo1(){
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left",posicaoX-velocidade);
        $("#inimigo1").css("top",posicaoY);
        
            //? If para que o Inimigo1 não saia fora da tela e retorne a posição inicial
            if(posicaoX<=0){
                posicaoY = parseInt(Math.random() * 334);
                $("#inimigo1").css("left",694);
                $("#inimigo1").css("top",posicaoY)
            }
    } // Fim da função moveinimigo1()

    //! Movimentação do Inimigo2
    function moveinimigo2(){
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left",posicaoX-2);

        //? If para que o Inimigo2 não saia fora da tela e retorne a posição inicial
        if(posicaoX<=0){
            $("#inimigo2").css("left",775);
        }
    } // Fim da função moveinimigo2()

    //! Movimentação do Amigo
    function moveamigo(){
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",posicaoX+1);
        
        //? If para que o Amigo não saia fora da tela e retorne a posição inicial
        if(posicaoX>906){
            $("#amigo").css("left",0);
        }
    } // fim da função moveamigo()

    //! Localização e disparo do Míssil 
    function disparo(){
        
        //? If para identificar se ele pode realizar o proximo tiro
        if(podeAtirar==true){

            somDisparo.play();
            podeAtirar=false;

            topo = parseInt($("#jogador").css("top"));
            posicaoX = parseInt($("#jogador").css("left"));
            tiroX = posicaoX + 190;
            topoTiro = topo + 50;
            $("#fundoGame").append("<div id='disparo'></div");
            $("#disparo").css("top",topoTiro);
            $("#disparo").css("left",tiroX);

            //? Movimentação do míssil e tempo
            var tempoDisparo=window.setInterval(executaDisparo,30);

        } // fim da função disparo()

        //? Velocidade do míssil 
        function executaDisparo(){
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left",posicaoX+20);

            //? Quando o míssil ultrapassar o valor posicaoX informado ele desaparecerá da tela e poderá ser excultado um novo disparo
            if(posicaoX>890){
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        } // Fim da função executaDisparo()
    } // Fim da Função disparo()

    //! Criando a colisão entre o jogador e o inimigo1
    function colisao(){
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));
        
        // jogador com o inimigo1        
        //? Após colisão o inimigo1 volta para posição inicial
        if (colisao1.length>0) {
            
            energiaAtual--;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);
        
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        } // Fim do if com o jogador e o inimigo1
        
        // jogador com o inimigo2 
        //? Após colisão o inimigo2 volta para posição inicial
        if (colisao2.length>0) {

                energiaAtual--;
                inimigo2X = parseInt($("#inimigo2").css("left"));
                inimigo2Y = parseInt($("#inimigo2").css("top"));
                explosao2(inimigo2X,inimigo2Y);
                        
                $("#inimigo2").remove();
                    
                reposicionaInimigo2();
            
        } // Fim do if como o jogador e o inimigo2
        
        // Disparo com o inimigo1
        //? Após colisão com o disparo no inimigo1 volta para posição inicial
		if (colisao3.length>0) {
            
            velocidade=velocidade+0.2; // almenta a velocidade do inimigo2 quando for destruido
            pontos=pontos+100; // Adiciona o valor declarado caso o inimigo2 for destruido
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
                
            explosao1(inimigo1X,inimigo1Y);
            $("#disparo").css("left",950);
                
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
                
        } // fim do if disparo com o inimigo1

        // Disparo com o inimigo2
		//? Após colisão com o disparo no inimigo2 volta para posição inicial
        if (colisao4.length>0) {
            
            pontos=pontos+50;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
        
            explosao2(inimigo2X,inimigo2Y);
            $("#disparo").css("left",950);
            
            reposicionaInimigo2();
                
        } // fim do if disparo com o inimigo2

        // jogador com o amigo
        //? Se a houver a colisão entre o jogador e o amigo ele será removido e executa a reposicionaAmigo()
        if (colisao5.length>0) {
            
            salvos++;
            somResgate.play();
            reposicionaAmigo();
            $("#amigo").remove();
        } 

                
        //Inimigo2 com o amigo
        //? Se a houver a colisão entre o Inimigo2 e o amigo, ele será removido e executa a reposicionaAmigo()       
        if (colisao6.length>0) {
            
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);
            $("#amigo").remove();
                    
            reposicionaAmigo();
                    
        }
    
        
    } //Fim da função colisao()

    //! Criando a esplosão após colisão do jogador e inimigo1
    function explosao1(inimigo1X,inimigo1Y) {

        somExplosao.play();
        $("#fundoGame").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        var div=$("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width:400, opacity:0}, "slow");
        
        //? Após animação da explosão, será retirado a animação
        var tempoExplosao=window.setInterval(removeExplosao, 1000);
        
            function removeExplosao() {
                
                div.remove();
                window.clearInterval(tempoExplosao);
                tempoExplosao=null;
                
            } // Fim da função removeExplosao()
            
    } // Fim da função explosao1()

    //! Após colisão do Inimigo2 ele será reposicionado na tela
	function reposicionaInimigo2() {
	
        //? Tempo determinado para o reposicionamento na tela
        var tempoColisao4=window.setInterval(reposiciona4, 5000);
            
            function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4=null;
                
                //? Caso o jogo terminei o inimigo não será reposicionado
                if (fimdejogo==false) {
                
                $("#fundoGame").append("<div id=inimigo2></div");
                
                }
                
            } // Fim da função reposiciona4()
        } // Fim da função posicionaInimigo2()

        
	 //! Criando a esplosão após colisão do inimigo2
	function explosao2(inimigo2X,inimigo2Y) {
	
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div>");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div2=$("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:400, opacity:0}, "slow");
        
        //? Após animação da explosão, será retirado a animação
        var tempoExplosao2=window.setInterval(removeExplosao2, 1000);
        
            function removeExplosao2() {
                
                div2.remove();
                window.clearInterval(tempoExplosao2);
                tempoExplosao2=null;
                
            } // Fim da função removeExplosao2()
            
            
    } // Fim da função explosao2()

    //Reposiciona Amigo
	//! Após colisão do jogador e o amigo ele será reposicionado na tela
	function reposicionaAmigo() {

        //? Tempo determinado para o reposicionamento na tela
        var tempoAmigo=window.setInterval(reposiciona6, 6000);
        
            function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo=null;
            
            //? Caso o jogo terminei o amigo não será reposicionado
            if (fimdejogo==false) {
            
            $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            
            }
            
        }
        
    } // Fim da função reposicionaAmigo()

    //Explosão3
    //! Criando a esplosão após colisão do Amigo
    function explosao3(amigoX,amigoY) {

        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);

        //? Após animação da explosão, será retirado a animação
        var tempoExplosao3=window.setInterval(resetaExplosao3, 1200);

            function resetaExplosao3() {
                $("#explosao3").remove();
                window.clearInterval(tempoExplosao3);
                tempoExplosao3=null;

        } // Fim da função resetaExplosao3()
    
    } // Fim da função explosao3

    function placar() {
        //? Atualizar a div placar
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
        
    } //fim da função placar()
    
    //! Criando a Função energia do jogo
    //Barra de energia
    function energia() {
        
        if (energiaAtual==3) {
            
            $("#energia").css("background-image", "url(imgs/energia3.png)");
        }

        if (energiaAtual==2) {
            
            $("#energia").css("background-image", "url(imgs/energia2.png)");
        }

        if (energiaAtual==1) {
            
            $("#energia").css("background-image", "url(imgs/energia1.png)");
        }

        if (energiaAtual==0) {
            
            $("#energia").css("background-image", "url(imgs/energia0.png)");
            
            //Game Over
            gameOver();
        }

    } // Fim da função energia()

    //Função GAME OVER
	function gameOver() {

        fimdejogo=true; //? fimdeogo=true para que o amigo não seja reposicionado na tela após o fim do jogo.
        musica.pause(); //? Pausar a música.
        somGameover.play(); //? Execulta uma nova música.
        
        //? Parar o game loop do jogo.
        window.clearInterval(jogo.timer);
        jogo.timer=null;
        
        //? Removendo do jogo.
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundoGame").append("<div id='fim'></div>");

        //? Mostra o placar final final do jogo.    
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
   
    } // Fim da função gameOver();

} // Fim da função start

//Reinicia o Jogo
		
function reiniciaJogo() {
    
	somGameover.pause(); //? Pausa a música de fundo
	$("#fim").remove(); //? Remove a mensagem Game Over
	start(); //? Chama a função principal do jogo.
	
} //Fim da fun��o reiniciaJogo