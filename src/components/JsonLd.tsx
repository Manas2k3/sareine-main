/**
 * Reusable JSON-LD structured data component.
 * Renders a <script type="application/ld+json"> tag with safely serialized data.
 *
 * Usage:
 *   <JsonLd data={productSchema} />
 */

interface JsonLdProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
