import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.css';

type ProductCardProps = {
	id: string;
	name: string;
	price: number;
	short: string;
	ingredients: string[];
	packaging: string;
	image?: string;
	href?: string;
};

export default function ProductCard({ id, name, price, short, ingredients, packaging, image, href }: ProductCardProps) {
	return (
		<article id={id} key={id} className={styles.card}>
			<Link href={href ?? '#'} className={styles.link}>
				<div className={styles.imageWrapper}>
					{image ? (
						<Image src={image} alt={name} fill className={styles.image} sizes="(min-width:1024px) 33vw, 90vw" />
					) : (
						<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>No image</div>
					)}
				</div>

				<div className={styles.content}>
					<h3 className={styles.title}>{name}</h3>
					<div className={styles.priceRow}>
						<span className={styles.price}>₹{price}</span>
					</div>

					<p className={styles.shortDesc}>{short}</p>

					<p className={styles.meta}><strong>Key ingredients:</strong> {ingredients.join(', ')}</p>
					<p className={styles.meta}><strong>Packaging:</strong> {packaging}</p>
				</div>
			</Link>
		</article>
	);
}
