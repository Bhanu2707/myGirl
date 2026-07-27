

export function useTypewriter(text, start) {
  return {
    visible: start ? text : '',  // Show full text if started
    done: start ? true : false   // Always done immediately
  };
}





