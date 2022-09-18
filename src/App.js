import React, {useEffect, useState} from 'react';

import {Collection} from './components/Collection';

import './index.scss';

function App() {
  const [serarchValue, setSearchValue] = useState('');
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1);

  useEffect(() => {
		setIsLoading(true);

		const category = categoryId ? `category=${categoryId}` : '';

    fetch(
      `http://localhost:3000/collections?_page=${page}&_limit=6&${category}`
    )
      .then((response) => response.json())
      .then((json) => {
        setCollections(json);
      })
      .catch((err) => {
        console.warn(err);
      }).finally(() => {
				setIsLoading(false);
			});
  }, [categoryId, page]);

  useEffect(() => {
    fetch('http://localhost:3000/categories')
      .then((response) => response.json())
      .then((json) => {
        setCategories(json);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);

  return (
    <div className="App">
      <h1>Photo Gallery</h1>
      <div className="top">
        <ul className="tags">
          {categories.map((obj, index) => (
            <li
              onClick={() => setCategoryId(index)}
              className={categoryId === index ? 'active' : ''}
              key={obj.name}
            >
              {obj.name}
            </li>
          ))}
        </ul>
        <input
          value={serarchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          placeholder="search"
        />
      </div>
      <div className="content">
        {isLoading ? (
          <h2>Loading...</h2>
        ) : (
          collections
            .filter((obj) => {
              return obj.name.toLowerCase().includes(serarchValue.toLowerCase());
            })
            .map((obj, index) => (
              <Collection key={index} name={obj.name} images={obj.photos} />
            ))
        )}
      </div>
      <ul className="pagination">
        {
					[...Array(5)].map((_, index) => (<li key={index} onClick={() => setPage(index+1)} className={page === (index +1) ? 'active' : ''}>{ index+1 }</li>))
				}
      </ul>
    </div>
  );
}

export default App;
