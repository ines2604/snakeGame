$(document).ready(function() {
    var direction = 'right';
    var snakeSize = 20;
    var snake = [];
    var food;
    var snakePosition = { x: 100, y: 200 };
    var score = 0;
    var gameInterval;

    function GameOver() {
        clearInterval(gameInterval); 
        $('.snake').remove();
        $('.food').remove();
        $('.play').show();
        $('#lose').show();
        $('button').text('Replay');
    }

    function startGame() {
        score = 0;
        $('#score').text(score);
        direction = 'right'; 
        snakePosition = { x: 100, y: 200 };
        $('.snake').remove();
        $('.food').remove();
        generateFood();
        createSnake();
        gameInterval = setInterval(moveSnake, 200); 
    }

    function generateFood() {
        var foodX, foodY;
        var positionValid = false;
    
        while (!positionValid) {
            foodX = Math.floor(Math.random() * 25)*snakeSize;
            foodY = Math.floor(Math.random() * 25)*snakeSize;

            positionValid = !snake.some(function(segment) {
                return segment.x === foodX && segment.y === foodY;
            });
        }
    
        food = $('<div></div>', {
            class: 'food'
        }).css({
            width: '20px',
            height: '20px',
            backgroundColor: '#ff0000',
            position: 'absolute',
            top: foodY + 'px',
            left: foodX + 'px'
        });
    
        $('.container').append(food);
    }

    function createSnake() {
        snake = [];
        var initialSnake = $('<div></div>', {
            class: 'snake'
        }).css({
            position: 'absolute',
            width: snakeSize + 'px',
            height: snakeSize + 'px',
            backgroundColor: '#00ff00',
            top: snakePosition.y + 'px',
            left: snakePosition.x + 'px'
        });

        $('.container').append(initialSnake);
        snake.push(initialSnake);
    }

    function moveSnake() {
        var newX = snakePosition.x;
        var newY = snakePosition.y;

        switch (direction) {
            case 'up':
                newY -= snakeSize;
                break;
            case 'down':
                newY += snakeSize;
                break;
            case 'left':
                newX -= snakeSize;
                break;
            case 'right':
                newX += snakeSize;
                break;
        }

        if (newX < 0 || newX >= 500 || newY < 0 || newY >= 500 || collisionWithSelf(newX, newY)) {
            GameOver();
            return;
        }

        snakePosition.x = newX;
        snakePosition.y = newY;

        for (var i = snake.length - 1; i > 0; i--) {
            var segment = snake[i];
            var prevSegment = snake[i - 1];
            segment.css({
                top: prevSegment.position().top + 'px',
                left: prevSegment.position().left + 'px'
            });
        }

        var head = snake[0];
        head.css({
            top: snakePosition.y + 'px',
            left: snakePosition.x + 'px'
        });

        if (Math.floor(head.position().top) === Math.floor(food.position().top) &&
            Math.floor(head.position().left) === Math.floor(food.position().left)) {
            score++;
            $('#score').text(score);
            food.remove();
            generateFood();
            growSnake();
        }
    }

    function growSnake() {
        var lastSegment = snake[snake.length - 1];
        var newPart = $('<div></div>', { class: 'snake' }).css({
            position: 'absolute',
            width: snakeSize + 'px',
            height: snakeSize + 'px',
            backgroundColor: '#00ff00'
        });

        $('.container').append(newPart);
        snake.push(newPart);

        newPart.css({
            top: lastSegment.position().top + 'px',
            left: lastSegment.position().left + 'px'
        });
    }

    function collisionWithSelf(x, y) {
        for (var i = 1; i < snake.length; i++) {
            var segment = snake[i];
            if (Math.floor(segment.position().top) === Math.floor(y) &&
                Math.floor(segment.position().left) === Math.floor(x)) {
                return true;
            }
        }
        return false;
    }

    $(document).on('keydown', function(event) {
        switch (event.which) {
            case 37: // Flèche gauche
                if (direction !== 'right') direction = 'left';
                break;
            case 38: // Flèche haut
                if (direction !== 'down') direction = 'up';
                break;
            case 39: // Flèche droite
                if (direction !== 'left') direction = 'right';
                break;
            case 40: // Flèche bas
                if (direction !== 'up') direction = 'down';
                break;
        }
    });

    $('button').on('click', function() {
        $('.play').hide();
        startGame();
    });
});