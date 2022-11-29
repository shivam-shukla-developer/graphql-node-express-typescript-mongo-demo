import { Route, Routes } from 'react-router';
import Header from './components/Header';
import { lazy, Suspense } from 'react';
const Authors = lazy(() => import("./pages/authors/Authors"))
const EditAuthor = lazy(() => import("./pages/authors/EditAuthor"))
const Books = lazy(() => import("./pages/books/Books"))
const EditBook = lazy(() => import("./pages/books/EditBook"))

export const ComponentLoad = ({Component}) => (
  <Suspense fallback={'Loading'}>
          <Component/>
  </Suspense>
);

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" exact element={<ComponentLoad  Component={Books}/>} />
        <Route path="/books" element={<ComponentLoad  Component={Books}/>} />
        <Route path="/books/:bookId" element={<ComponentLoad  Component={EditBook}/>} />
        <Route path="/authors" element={<ComponentLoad  Component={Authors}/>} />
        <Route path="/authors/:authorId" element={<ComponentLoad  Component={EditAuthor}/>} />
      </Routes>
    </div>
  );
}

export default App;
