import { ScoredNotification } from "./types";

export class MinHeap {
    private heap: ScoredNotification[] = [];
    private capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    private parent(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    private left(index: number): number {
        return index * 2 + 1;
    }

    private right(index: number): number {
        return index * 2 + 2;
    }

    private swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    private bubbleUp(index: number): void {
        while (index > 0 && this.heap[this.parent(index)].score > this.heap[index].score) {
            this.swap(index, this.parent(index));
            index = this.parent(index);
        }
    }

    private bubbleDown(index: number): void {
        let min = index;
        const left = this.left(index);
        const right = this.right(index);

        if (left < this.heap.length && this.heap[left].score < this.heap[min].score) {
            min = left;
        }

        if (right < this.heap.length && this.heap[right].score < this.heap[min].score) {
            min = right;
        }

        if (min !== index) {
            this.swap(index, min);
            this.bubbleDown(min);
        }
    }

    insert(item: ScoredNotification): void {
        if (this.heap.length < this.capacity) {
            this.heap.push(item);
            this.bubbleUp(this.heap.length - 1);
            return;
        }

        if (item.score > this.heap[0].score) {
            this.heap[0] = item;
            this.bubbleDown(0);
        }
    }

    getTopN(): ScoredNotification[] {
        return [...this.heap].sort((a, b) => b.score - a.score);
    }
}
