const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Các chế độ game
const MODES = {
    NORMAL: 'normal',
    MULTI_BALL: 'multi_ball',
};

// Thiết lập chế độ mặc định
let currentMode = MODES.NORMAL;

let ballRadius = 10;
let ballSpeed = { dx: getRandomSpeed(), dy: getRandomSpeed() };  // Tốc độ bóng
let balls = [{ x: canvas.width / 2, y: canvas.height - 30, dx: ballSpeed.dx, dy: ballSpeed.dy }];
let paddleHeight = 10;
let paddleWidth = 200;  // Thanh đỡ dài trong chế độ 1
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleSpeed = 10;
let rightPressed = false;
let leftPressed = false;

let brickRowCount = 8;
let brickColumnCount = 10;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

let score = 0;
let lives = 3;
let gameOver = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Hàm điều khiển di chuyển paddle
function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// Hàm tạo vận tốc ngẫu nhiên cho bóng
function getRandomSpeed() {
    let speed = 4 + Math.random() * 4;  // Bóng nhanh hơn
    return (Math.random() > 0.5 ? speed : -speed);
}

// Hàm xử lý va chạm với gạch
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                for (let i = 0; i < balls.length; i++) {
                    let ball = balls[i];
                    if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                        ball.dy = -ball.dy;
                        b.status = 0;
                        score++;
                        if (score === brickRowCount * brickColumnCount) {
                            alert('Chúc mừng! Bạn đã phá tất cả các viên gạch!');
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }
}

// Tạo bóng mới khi có sự kiện phá gạch
function createNewBall() {
    let newBall = { x: canvas.width / 2, y: canvas.height - 30, dx: getRandomSpeed(), dy: getRandomSpeed() };
    balls.push(newBall);  // Thêm bóng mới vào mảng balls
}

// Hàm vẽ bóng
function drawBalls() {
    for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FF0000'; // Màu bóng
        ctx.fill();
        ctx.closePath();
    }
}

// Vẽ thanh đỡ
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#008000'; // Màu thanh đỡ
    ctx.fill();
    ctx.closePath();
}

// Vẽ các viên gạch
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#000000'; // Màu gạch
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Vẽ điểm số
function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Điểm: ' + score, 8, 20);
    ctx.fillText('Mạng: ' + lives, canvas.width - 100, 20);
}

// Hiển thị Game Over
function showGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillStyle = '#FF0000';
    ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
    ctx.font = '16px Arial';
    ctx.fillText('Nhấn F5 để chơi lại', canvas.width / 2 - 70, canvas.height / 2 + 30);
}

// Tạo bóng mới sau khi chết
function resetBalls() {
    balls = [{ x: canvas.width / 2, y: canvas.height - 30, dx: ballSpeed.dx, dy: ballSpeed.dy }];
}

// Hàm vẽ menu khi chưa chọn chế độ
function drawMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillStyle = '#FF0000';
    ctx.fillText('Chọn Chế Độ:', canvas.width / 2 - 100, canvas.height / 2 - 60);
    ctx.font = '20px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('1. Chế Độ Bình Thường', canvas.width / 2 - 120, canvas.height / 2);
    ctx.fillText('2. Chế Độ Nhiều Bóng', canvas.width / 2 - 120, canvas.height / 2 + 30);
    ctx.fillText('Nhấn 1 hoặc 2 để chọn chế độ', canvas.width / 2 - 150, canvas.height / 2 + 60);
}

// Hàm xử lý nhập chọn chế độ
function handleModeSelection(e) {
    if (e.key === '1') {
        currentMode = MODES.NORMAL;
        startGame();
    } else if (e.key === '2') {
        currentMode = MODES.MULTI_BALL;
        startGame();
    }
}

// Hàm bắt đầu trò chơi
function startGame() {
    document.removeEventListener('keydown', handleModeSelection);
    gameOver = false;
    score = 0;
    lives = 3;
    brickRowCount = 8;
    brickColumnCount = 10;
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    // Điều chỉnh các tham số theo chế độ
    if (currentMode === MODES.NORMAL) {
        paddleWidth = 200;  // Thanh đỡ dài cho chế độ bình thường
        balls = [{ x: canvas.width / 2, y: canvas.height - 30, dx: getRandomSpeed(), dy: getRandomSpeed() }];
    } else if (currentMode === MODES.MULTI_BALL) {
        paddleWidth = 150;  // Thanh đỡ ngắn lại trong chế độ nhiều bóng
        balls = [{ x: canvas.width / 2, y: canvas.height - 30, dx: getRandomSpeed(), dy: getRandomSpeed() }];
        // Tăng tốc độ bóng trong chế độ nhiều bóng
        ballSpeed = { dx: getRandomSpeed() * 1.2, dy: getRandomSpeed() * 1.2 };
        createNewBall();  // Tạo thêm một quả bóng
    }
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', handleModeSelection, false);

// Vẽ lại toàn bộ
function gameLoop() {
    if (gameOver) {
        showGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBricks();
    drawBalls();
    drawPaddle();
    drawScore();
    collisionDetection();

    // Điều khiển paddle
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }

    // Cập nhật vị trí bóng
    for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
            ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy < ballRadius) {
            ball.dy = -ball.dy;
        } else if (ball.y + ball.dy > canvas.height - ballRadius) {
            if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
                ball.dy = -ball.dy;
            } else {
                lives--;
                if (lives <= 0) {
                    gameOver = true;
                } else {
                    resetBalls();
                }
            }
        }
    }

    // Tiếp tục vòng lặp
    requestAnimationFrame(gameLoop);
}

// Vẽ menu khi chưa chọn chế độ
drawMenu();
