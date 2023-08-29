import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [top20, setTop20] = useState([]);
	const [page, setPage] = useState(0);

	useEffect(() => {
		fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
			.then((res) => res.json())
			.then((data) => {
				const top20ArticleIds = data.slice(page, page + 20);
				const articlePromises = top20ArticleIds.map((articleId) =>
					fetch(`https://hacker-news.firebaseio.com/v0/item/${articleId}.json`).then((res) => res.json())
				);
				Promise.all(articlePromises).then((articleData) => {
					setTop20(articleData);
					setFilteredList(articleData);
				});
			});
	}, [page]);

	const [filteredList, setFilteredList] = useState([]);
	const handleFilter = (e) => {
		const filteredValues =
			e === ""
				? top20.filter((article) => {
						return article.title.toLowerCase().includes(e);
				  })
				: top20.filter((article) => {
						return article.title.toLowerCase().includes(e.target.value.toLowerCase());
				  });
		e === "" ? setInput(e) : setInput(e.target.value);
		setFilteredList(filteredValues);
	};

	const searchResults = filteredList.map((article, i) => {
		return (
			<a href={article.url}>
				<p key={i}>{article.title}</p>
			</a>
		);
	});
	const [input, setInput] = useState(" ");
	const incrementPage = () => {
		handleFilter("");
		setPage(page + 20);
	};

	console.log(page);

	return (
		<>
			<button onClick={incrementPage}>Next Page</button>
			<input type="text" value={input} onChange={handleFilter} />
			<ul>{searchResults}</ul>
		</>
	);
}

export default App;
