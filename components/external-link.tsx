import * as WebBrowser from 'expo-web-browser';
import { Link } from 'expo-router';
import { ComponentProps } from 'react';

export function ExternalLink(props: ComponentProps<typeof Link>) {
  return (
    <Link
      target="_blank"
      {...props}
      onPress={async (event) => {
        props.onPress?.(event);
        if (!event.defaultPrevented) {
          event.preventDefault();
          await WebBrowser.openBrowserAsync(String(props.href));
        }
      }}
    />
  );
}
