import pandas as pd
df = pd.read_csv(r'players_20.csv')
print(df.groupby('nationality').count())
index = df[df.nationality=='Afghanistan'].index
df.drop(index, inplace=True)
print(df.groupby('nationality').count())