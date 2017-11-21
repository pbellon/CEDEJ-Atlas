# Le projet

_Aridity World Map_ permet de créer des cartes à différentes échelles, avec un calcul en temps réel des données relatives à l’aridité. Cette interface offre un support exceptionnel pour modéliser et envisager différents scenarii d’évolution des zones arides.

Cette carte interactive a été conçue à partir de la carte mondiale des zones arides et semi-arides réalisée par le Centre d’Études et de Réalisations Cartographiques et Géographiques (CERCG) du CNRS et publiée en 1977 par l’UNESCO à l’échelle 1/25 000 000e. En analysant sa légende, deux laboratoires de recherche ont élaboré une base de données à référence spatiale (SIRS) : à Paris, le Laboratoire d’Informatique et de Systèmes Complexes (LaISC) de l’[École Pratique des Hautes Études](https://www.ephe.fr/) (EPHE) aujourd’hui devenu [Laboratoire Cognition Artificielle et humaine](http://www.cognition-usages.org/chart2/) (CHArt) et, au Caire, le [Centre d’Études et de Documentation Juridiques, Économiques et sociales](cedej-eg.org) (CEDEJ) rattaché au CNRS.

## Les étapes

- En 2011, à l’issue de la 3ème conférence internationale WATARID, le comité scientifique de la manifestation suggère la création d’une carte mondiale interactive des zones arides.

- Entre 2011 et 2014, le CEDEJ et le LaISC se sont employés à constituer une base de données sur l’aridité à partir d’une lecture minutieuse et approfondie de la carte mondiale éditée par l’UNESCO. Cette carte (fig.1) combine plusieurs types de projections astronomiques et différents systèmes géodésiques : les régions du monde n’y sont pas représentées selon le même référentiel géographique. Une projection conforme bipolaire oblique est utilisée pour les Amériques tandis que le système Miller stéréographique aplati est employé pour le reste du monde.


![Carte originale de l'Unesco](/images/Fig_1.jpg)

- La première étape du travail accompli par le CEDEJ et le LaISC a consisté à établir un géoréférencement uniforme de l’image de la carte publiée par l’UNESCO selon le système géodésique mondial WGS84 (World Geodesic System 1984). Ce référentiel géographique WGS84 est associé au GPS et au type de projection UTM (Universal Transverse Mercator).
La carte initiale a ainsi été découpée en carrés, tous géoréférencés selon un unique référentiel géographique. Des algorithmes ont permis d’ajuster cette mosaïque  (fig.2) qui constitue une nouvelle image (*raster*).

![Carte découpée en raster](/images/Fig_2.jpg)

Dans un second temps, cette nouvelle image a fait l’objet d’une digitalisation (vectorisation) de façon à mettre au point une carte digitalisée muette du monde (fig.3).

![Carte digitalisée](/images/Fig_3.jpg)

- A défaut de disposer d’une base de données numérique sur l’aridité, les équipes du CEDEJ et du LaISC ont entrepris la création de cette base à partir des informations fournies dans la carte éditée par l’UNESCO et sa légende, lesquelles croisent quatre variables : le type d’aridité, la température, le nombre de mois secs par an et le régime des précipitations.
Les zones subhumides, arides et hyperarides de la carte de l’aridité (1977) ont chacune été identifiées et tracées selon un codage inédit pour construire une base de données à référence spatiale (SIRS). Cette base consigne, au moyen de calques (fig.4), toutes les caractéristiques propres aux critères de l’aridité définis dans le « Programme mondial  de recherches sur la zone aride » de l’UNESCO (1951-1964).

![Calques d'aridité](/images/Fig_4.jpg)

- En 2017, le pôle « Humanités numériques » du CEDEJ lance le portail *http://aridityworldmap.org*, en libre accès, sous la conduite de Hala Bayoumi, ingénieure de recherches au CNRS. Cette interface propose une carte mondiale de l’aridité à référence spatiale (SIRS) associée à la base de données établie avec les quatre variables initiales (type d’aridité, température, durée de la sécheresse, régime pluviométrique). Cette carte mondiale SIRS est une carte interactive : elle permet la sélection ou/et la combinaison des variables de l’aridité à différentes échelles spatiales.

- *Aridity World Map* s’inscrit dans une démarche de science participative et citoyenne. La base de données sur l’aridité à référence spatiale pourra être actualisée et enrichie d’illustrations et de données, grâce à la [collaboration de la communauté scientifique, des décideurs ou des acteurs de la société civile](/page/contribute).
