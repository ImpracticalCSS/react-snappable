class ExtendedMap<K, V> extends Map<K, V> {
    public find = (condition: (item: V) => boolean): V | undefined => {
        let item: V | undefined = undefined;

        this.forEach((value) => {
            if (item) return;
            
            if (condition(value)) {
                item = value;
            }
        });

        return item;
    }
}

export default ExtendedMap;
