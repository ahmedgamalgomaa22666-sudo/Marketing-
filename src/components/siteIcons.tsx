import { ArrowRight as A, Download as D, Link2, Mail as M, MapPin as P } from "lucide-react";

/** Small, consistent icon set for the public site (no brand logos). */
const size = { size: 16, strokeWidth: 1.75 };
export const ArrowRight = () => <A {...size} />;
export const Download = () => <D {...size} />;
export const Mail = () => <M {...size} />;
export const MapPin = () => <P {...size} />;
export const Linkedin = () => <Link2 {...size} />;
