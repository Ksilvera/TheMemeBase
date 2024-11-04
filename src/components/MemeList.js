import React, {useEffect, useState} from "react";
import {db} from "./firebase"
import Pagination from "react-js-pagination";
import MemeListItem from "./MemeListItem";
import { getFirestore, collection, doc, onSnapshot, orderBy, query} from "firebase/firestore";

const MemeList = ({user, isUnfiltered}) => {
    const [memes, setMemes] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [favorites, setFavorites] = useState({});

    useEffect(() => {
        const memesCollection = isUnfiltered
            ? collection(db,"memes")
            : collection(doc(db, "users", user.email), "memes");
        
        const memesQuery = query(memesCollection, orderBy("timestamp", "desc"));
        const unsubscribeMemes = onSnapshot(memesQuery,docSnapShot =>{
            const memesData = docSnapShot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }));
            setMemes(memesData);
        });

        if(user){
            const favoritesCollection = collection(doc(db,"users",user.email),"memes");
            const unsubscribeFavorites = onSnapshot(favoritesCollection,docSnapshot => {
                const favoritesData = {};
                docSnapshot.forEach(doc => {
                    favoritesData[doc.id] = true;
                });
                setFavorites(favoritesData);
            });

            return () => {
                unsubscribeFavorites();
            };
        }

        return () => {
            unsubscribeMemes();
        };
    }, [user, isUnfiltered]);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    const itemsCountPerPage = 10;
    const indexOfLastItem = activePage * itemsCountPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
    const currentItems = memes.slice(indexOfFirstItem, indexOfLastItem);

    return(
        <div>
            <Pagination
                activePage={activePage}
                itemsCountPerPage={itemsCountPerPage}
                totalItemsCount={memes.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
            />
            {currentItems.map(meme => (
                <MemeListItem
                    key={meme.id}
                    user={user}
                    isFavorite={favorites[meme.id]}
                    meme={meme}
                />
            ))}
            <Pagination
                activePage={activePage}
                itemsCountPerPage={itemsCountPerPage}
                totalItemsCount={memes.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
            />
        </div>
    );
};

export default MemeList
