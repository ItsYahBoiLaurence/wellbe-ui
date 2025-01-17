import { rem } from '@mantine/core';

interface Props extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function ThumbDownIcon({ size, style, ...props }: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: rem(size), height: rem(size), ...style }}
      {...props}
    >
      <path
        d="M16.202 13.2345C16.202 13.2345 14.3935 18.3115 12.9918 19.1364C11.5902 19.9613 10.6558 18.6692 10.6558 17.7348C10.6558 16.8003 11.2969 13.8878 11.2969 13.8878L6.17468 14.5281C4.87892 14.6901 3.79836 13.5478 4.03196 12.263L5.15152 6.10546C5.34152 5.06045 6.33872 4.36421 7.38521 4.54591L16.202 6.07676M16.202 13.2345V6.07676M16.202 13.2345H18.4808C18.8837 13.2345 19.2701 13.0745 19.555 12.7896C19.8399 12.5047 20 12.1183 20 11.7153V7.59594C20 7.19303 19.8399 6.80662 19.555 6.52172C19.2701 6.23682 18.8837 6.07676 18.4808 6.07676H16.202"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ThumbDownIcon;
