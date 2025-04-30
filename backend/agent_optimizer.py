import numpy as np
import tensorflow as tf

class InventoryRLAgent:
    def __init__(self, state_size, action_size, learning_rate=0.001):
        self.state_size = state_size
        self.action_size = action_size
        self.model = self._build_model(learning_rate)

    def _build_model(self, learning_rate):
        model = tf.keras.Sequential([
            tf.keras.layers.Input(shape=(self.state_size,)),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(self.action_size, activation='linear')
        ])
        model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=learning_rate), loss='mse')
        return model

    def train(self, state, action, reward, next_state, done, gamma=0.95):
        state = np.reshape(state, [1, self.state_size])
        next_state = np.reshape(next_state, [1, self.state_size])

        target = self.model.predict(state)[0]
        next_q = np.max(self.model.predict(next_state)[0])
        target[action] = reward + (0 if done else gamma * next_q)

        target = np.reshape(target, [1, self.action_size])
        self.model.fit(state, target, epochs=1, verbose=0)