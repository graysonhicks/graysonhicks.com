import React from 'react';
import Gallery from '../Gallery';
import Gram from './Gram';
import GramEndPost from './GramEndPost';

let breakPoints = [516];

const Insta = ({ posts }) => {
  const items = posts.map(post => <Gram key={post.id} {...post} />);

  return (
    <Gallery
      breakPoints={breakPoints}
      posts={items}
      endPost={<GramEndPost />}
    />
  );
};

export default Insta;
