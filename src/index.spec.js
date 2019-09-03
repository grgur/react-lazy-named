import React, { Suspense } from 'react';
import { create } from 'react-test-renderer';
import lazy from './index';

function Text(props) {
  return props.text;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

async function fakeImport(result) {
  return { default: result };
}

describe('useWhyChange', () => {
  it('stays quiet if updates never happen', async () => {
    const LazyText = lazy(() => fakeImport(Text));

    const root = create(
      <Suspense fallback={<Text text="Loading..." />}>
        <LazyText text="Hi" />
      </Suspense>
    );

    expect(root.toJSON()).toMatchSnapshot();

    await delay(10);

    expect(root.toJSON()).toMatchSnapshot();
  });
});
