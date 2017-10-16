import React from "react";
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3000');
console.log(socket);

export default class Game1 extends React.Component {
    render() {
        return ( 
            <Game/>
        );
    }
}

function Square(props) {
    return ( 
        <button  className = "square" onClick = { props.onClick} > { props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return ( <Square value = {
                this.props.squares[i]
            }
            onClick = {
                () => this.props.onClick(i)
            }
            />
        );
    }

    render() {
        return ( <div >
            <div className = "board-row" > {
                this.renderSquare(0)
            } {
                this.renderSquare(1)
            } {
                this.renderSquare(2)
            } </div> 
            <div className = "board-row" > {
                this.renderSquare(3)
            } {
                this.renderSquare(4)
            } {
                this.renderSquare(5)
            } 
            </div> 
            <div className = "board-row" > {
                this.renderSquare(6)
            } {
                this.renderSquare(7)
            } {
                this.renderSquare(8)
            } 
            </div> 
            </div >
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
            rivalsocketid : null
        };
        socket.on('connect', () => {
            console.log(socket.id); // 'G5p5...'
           socket.emit('newuser',socket.id);

        });
        socket.on('rival', (socketid) => this.RivalUserInState(socketid));
        socket.on('handleEvents',(squares,history) => this.handleState(squares,history));
    }

    componentDidMount() {
        if (this.state.rivalsocketid == null) {
          //No one is here need to wait
        } else {
          //Rival is on
        }
    }

    RivalUserInState(socketid) {
        this.setState({
            rivalsocketid :  socketid,
            mysocketid :  socket.id
        });
        console.log("My rival",this.state.rivalsocketid);
        console.log("My socket id",this.state.mysocketid);
    }
    

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        socket.emit('handleClickevent',history,squares,this.state.rivalsocketid,this.state.mysocketid);
    }

    handleState (squares,history) {
        console.log(squares);
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? "Move #" + move : "Game start";
            console.log(move);
            return ( <li key = {
                    move
                } >
                <a href = "#"
                onClick = {
                    () => this.jumpTo(move)
                } > {
                    desc
                } </a> 
                </li >
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return ( <div className = "game" >
            <div className = "game-board" >
            <Board squares = {
                current.squares
            }
            onClick = {
                i => this.handleClick(i)
            }
            /> </div > 
            <div className = "game-info" >
            <div > {
                status
            } </div> 
            <ol > {
                moves
            } </ol> 
            </div > 
            </div>
        );
    }
}

// ========================================

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}