import Image from 'next/image';
import Link from 'next/link';

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
		<article id={id} key={id} style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
			<Link href={href ?? '#'} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
				<div style={{ position: 'relative', width: '100%', height: 220, background: '#fafafa' }}>
					{image ? (
						<Image src={image} alt={name} fill style={{ objectFit: 'cover' }} sizes="(min-width:1024px) 33vw, 90vw" />
					) : (
						<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>No image</div>
					)}
				</div>

				<div style={{ padding: '1rem' }}>
					<h3 style={{ margin: 0, fontSize: '1.05rem' }}>{name}</h3>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
						<span style={{ fontWeight: 700 }}>₹{price}</span>
					</div>

					<p style={{ marginTop: '0.5rem', color: '#444' }}>{short}</p>

					<p style={{ marginTop: '0.75rem', fontSize: '0.95rem' }}><strong>Key ingredients:</strong> {ingredients.join(', ')}</p>
					<p style={{ marginTop: '0.25rem', fontSize: '0.95rem' }}><strong>Packaging:</strong> {packaging}</p>
				</div>
			</Link>
		</article>
	);
}

