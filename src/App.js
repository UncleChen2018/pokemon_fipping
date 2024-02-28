import React, { useState, useEffect } from 'react';
import shuffle from 'lodash.shuffle';
import './App.css';

// image for the pokemon
// https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.id}.png

export const pokemons = [
	{ id: '004', name: 'charizard' },
	{ id: '010', name: 'caterpie' },
	{ id: '077', name: 'ponyta' },
	{ id: '108', name: 'lickitung' },
	{ id: '132', name: 'ditto' },
	{ id: '133', name: 'eevee' },
];
const doublePokemon = shuffle([...pokemons, ...pokemons]);

export default function App() {
	// all cards that are opened
	const [opened, setOpened] = useState([]); // using index | this state only have 2 items max with the selection from user
	// the cards wait to be matched
	const [toPair, setToPair] = useState([]); // using index | this state only have 2 items max with the selection from user
	const [isMatching, setIsMatching] = useState(false);

	// should be another state to check if the
	const [count, setCount] = useState(0); // count of moves


        
	function flipCard(index) {
		// if same card was clicked do nothing
		if (opened.includes(index)) return;
		// still comparing, do nothing
		if (isMatching) return;
		// add the index to the opened array
		// the opened array can only have even items
		setOpened((opened) => [...opened, index]);
		// add the count of moves
		setCount((count) => count + 1);
		// add the card to the pair array
		setToPair((toPair) => {
            return [...toPair, index]
		});
	}

    // useEffect to check if the to-pair cards are matching
    useEffect(() => {
        if (toPair.length <= 1) return;
        // this limit the user to flip more cards while comparing
        setIsMatching(true);
        setTimeout(() => {
            if (doublePokemon[toPair[0]].id !== doublePokemon[toPair[1]].id) {
            setOpened((opened) =>
                opened.filter((i) => i !== toPair[0] && i !== toPair[1])
            );  
            } 
            setToPair([]);
            setIsMatching(false);
        }, 600);
    },[toPair]);

	// useEffect to check if the game is over
	useEffect(() => {
		if (opened.length === doublePokemon.length) {
			setTimeout(() => {
				alert('you won!');
			}, 100);
		}
	}, [opened]);

	return (
		<div className='app'>
			<p data-testid='moves-count'>
				{count} <strong>moves</strong>
			</p>

			<div className='cards'>
				{doublePokemon.map((pokemon, index) => {
					let isFlipped = false;

					if (opened.includes(index)) isFlipped = true;

					return (
						<PokemonCard
							key={index}
							index={index}
							pokemon={pokemon}
							isFlipped={isFlipped}
							flipCard={flipCard}
						/>
					);
				})}
			</div>
		</div>
	);
}

export function PokemonCard({ index, pokemon, isFlipped, flipCard }) {
	return (
		<button
			className={`pokemon-card ${isFlipped ? 'flipped' : ''}`}
			onClick={() => flipCard(index)}
			aria-label={`pokemon-card-${pokemon.name}`}
		>
			<div className='inner'>
				<div className='front'>
					<img
						src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.id}.png`}
						alt={pokemon.name}
						width='100'
					/>
				</div>
				<div className='back'>?</div>
			</div>
		</button>
	);
}
