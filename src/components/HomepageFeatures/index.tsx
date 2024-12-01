import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { useColorMode } from '@docusaurus/theme-common'

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  { scale: 1.0,
    fill:"currentColor",
    title: 'Building Web4',
    Svg: require('@site/static/img/clouds.svg').default,
    description: (
      <>
        Laying the groundwork for Web4, the next generation of the Internet.
      </>
    ),
  },
  { scale: 1.0,
    fill:"currentColor",
    title: 'ThreeFold Grid',
    Svg: require('@site/static/img/nodes.svg').default,
    description: (
      <>
        ThreeFold nodes, routers and phones create an end&#8209;to&#8209;end encrypted network.
      </>
    ),
  },
  { scale: 1.0,
    fill:"currentColor",
    title: 'Community Rewards',
    Svg: require('@site/static/img/rewards.svg').default,
    description: (
      <>
        The ecosystem rewards the community to foster growth and expansion.
      </>
    ),
  },
];

function Feature({scale, fill, id, title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
      <Svg transform={"scale(" + scale + ")"} fill={fill} id={id} className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
